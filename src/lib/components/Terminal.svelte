<script lang="ts">
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { stack } from '$lib/data/stack';
	import { profile } from '$lib/data/profile';

	type Line = { kind: 'in' | 'out' | 'ok' | 'err'; text: string };

	let lines = $state<Line[]>([
		{ kind: 'out', text: 'nanwp.com shell — type `help` to list commands.' }
	]);
	let value = $state('');
	let busy = $state(false);
	let history: string[] = [];
	let cursor = -1;
	let screen = $state<HTMLElement>();
	let input = $state<HTMLInputElement>();

	const print = (text: string, kind: Line['kind'] = 'out') => void lines.push({ kind, text });

	const commands: Record<string, { help: string; run: (args: string[]) => void | Promise<void> }> =
		{
			help: {
				help: 'list commands',
				run: () => {
					for (const [name, c] of Object.entries(commands)) print(`  ${name.padEnd(10)} ${c.help}`);
				}
			},
			whoami: {
				help: 'who runs this box',
				run: () => {
					print(`${profile.name} — ${profile.title}`);
					print(`${profile.yearsExperience} yrs · ${profile.location} (${profile.timezone})`);
					print(`${profile.availability}: ${profile.relocation.join(' / ')}`, 'ok');
				}
			},
			stack: {
				help: 'print the tech stack',
				run: () => {
					for (const g of stack)
						print(`  ${g.title.padEnd(16)} ${g.items.map((i) => i.name).join(', ')}`);
				}
			},
			ping: {
				help: 'ping nanwp.com (real round-trips from your browser)',
				run: async (args) => {
					const host = args[0] ?? 'nanwp.com';
					if (host !== 'nanwp.com' && host !== location.host) {
						print(`ping: ${host}: only nanwp.com answers from this sandbox`, 'err');
						return;
					}
					print(`PING ${host}: 4 requests`);
					const times: number[] = [];
					for (let i = 0; i < 4; i++) {
						const t0 = performance.now();
						try {
							await fetch(`${location.origin}/?ping=${Date.now()}`, {
								method: 'HEAD',
								cache: 'no-store'
							});
							const ms = performance.now() - t0;
							times.push(ms);
							print(`reply from ${host}: seq=${i} time=${ms.toFixed(1)} ms`, 'ok');
						} catch {
							print(`request timeout for seq ${i}`, 'err');
						}
						await new Promise((r) => setTimeout(r, 300));
					}
					if (times.length) {
						const avg = times.reduce((a, b) => a + b, 0) / times.length;
						print(
							`--- ${times.length}/4 received · min/avg/max = ${Math.min(...times).toFixed(1)}/${avg.toFixed(1)}/${Math.max(...times).toFixed(1)} ms`
						);
					}
				}
			},
			cv: {
				help: 'download my CV (PDF)',
				run: () => {
					print(`fetching ${profile.resumeUrl} …`, 'ok');
					const a = Object.assign(document.createElement('a'), {
						href: profile.resumeUrl,
						download: ''
					});
					a.click();
				}
			},
			contact: {
				help: 'how to reach me',
				run: () => {
					print('  email     nanwp.dev@gmail.com');
					print('  github    github.com/nanwp');
					print('  linkedin  linkedin.com/in/nanwp');
					print('  tip: `mail` opens your mail client');
				}
			},
			mail: {
				help: 'compose an email',
				run: () => void (location.href = 'mailto:nanwp.dev@gmail.com')
			},
			blog: { help: 'open the blog', run: () => void goto('/blog') },
			clear: { help: 'clear the screen', run: () => void (lines = []) }
		};

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		const raw = value.trim();
		value = '';
		if (!raw || busy) return;
		history.unshift(raw);
		cursor = -1;
		print(raw, 'in');

		const [name, ...args] = raw.split(/\s+/);
		const cmd = commands[name.toLowerCase()];
		busy = true;
		if (cmd) await cmd.run(args);
		else if (name === 'sudo') print('nice try. this incident will be reported to /dev/null', 'err');
		else print(`command not found: ${name} — try \`help\``, 'err');
		busy = false;

		await tick();
		screen?.scrollTo({ top: screen.scrollHeight });
		input?.focus();
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'ArrowUp' && history.length) {
			e.preventDefault();
			cursor = Math.min(cursor + 1, history.length - 1);
			value = history[cursor];
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			cursor = Math.max(cursor - 1, -1);
			value = cursor === -1 ? '' : history[cursor];
		}
	}

	const color: Record<Line['kind'], string> = {
		in: 'text-white',
		out: 'text-ink-muted',
		ok: 'text-emerald-glow',
		err: 'text-amber-300'
	};
</script>

<div class="panel edge-light mono overflow-hidden text-[12px]">
	<div class="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
		<span class="h-2.5 w-2.5 rounded-full bg-white/10"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-white/10"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-white/10"></span>
		<span class="ml-2 text-[11px] text-ink-faint">guest@nanwp.com: ~</span>
	</div>

	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div bind:this={screen} class="h-56 overflow-y-auto px-4 py-3" onclick={() => input?.focus()}>
		{#each lines as l}
			<p class="whitespace-pre-wrap break-words {color[l.kind]}">
				{#if l.kind === 'in'}<span class="text-cyan-glow">❯ </span>{/if}{l.text}
			</p>
		{/each}

		<form onsubmit={submit} class="flex items-center gap-2">
			<span class="text-cyan-glow">❯</span>
			<input
				bind:this={input}
				bind:value
				onkeydown={onKey}
				disabled={busy}
				aria-label="Terminal input"
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
				placeholder={lines.length < 2 ? 'try: ping nanwp.com' : ''}
				class="w-full border-0 bg-transparent p-0 text-[12px] text-white placeholder:text-ink-faint focus:ring-0 focus-visible:outline-none"
			/>
		</form>
	</div>
</div>
