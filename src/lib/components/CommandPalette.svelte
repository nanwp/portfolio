<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import { ui } from '$lib/stores/ui.svelte';

	interface Command {
		group: string;
		label: string;
		hint: string;
		run: () => void;
	}

	const nav = (href: string) => () => goto(href);
	const open = (href: string) => () => window.open(href, '_blank', 'noopener');

	let copied = $state(false);

	const commands: Command[] = [
		{ group: 'Navigate', label: 'Architecture', hint: '#architecture', run: nav('/#architecture') },
		{ group: 'Navigate', label: 'Telemetry & impact', hint: '#telemetry', run: nav('/#telemetry') },
		{ group: 'Navigate', label: 'Engineering case studies', hint: '#work', run: nav('/#work') },
		{ group: 'Navigate', label: 'Experience', hint: '#experience', run: nav('/#experience') },
		{ group: 'Navigate', label: 'Blog', hint: '/blog', run: nav('/blog') },
		{ group: 'Navigate', label: 'Contact & terminal', hint: '#contact', run: nav('/#contact') },
		{
			group: 'Actions',
			label: 'Download CV (PDF)',
			hint: 'resume.pdf',
			run: () => window.open('/Nanda_Wijaya_Putra_CV.pdf', '_blank', 'noopener')
		},
		{
			group: 'Actions',
			label: 'Copy email address',
			hint: 'nanwp.dev@gmail.com',
			run: () => {
				navigator.clipboard?.writeText('nanwp.dev@gmail.com');
				copied = true;
				setTimeout(() => (copied = false), 1600);
			}
		},
		{
			group: 'Links',
			label: 'GitHub',
			hint: 'github.com/nanwp',
			run: open('https://github.com/nanwp')
		},
		{
			group: 'Links',
			label: 'LinkedIn',
			hint: 'in/nanwp',
			run: open('https://linkedin.com/in/nanwp')
		},
		{ group: 'Links', label: 'Medium', hint: '@nanwp', run: open('https://medium.com/@nanwp') }
	];

	let query = $state('');
	let active = $state(0);
	let input = $state<HTMLInputElement>();

	const results = $derived(
		commands.filter((c) =>
			(c.label + ' ' + c.hint + ' ' + c.group).toLowerCase().includes(query.trim().toLowerCase())
		)
	);

	$effect(() => {
		if (ui.paletteOpen) {
			query = '';
			active = 0;
			tick().then(() => input?.focus());
		}
	});

	function run(c: Command) {
		c.run();
		if (c.group !== 'Actions') ui.paletteOpen = false;
	}

	function onGlobalKey(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			ui.paletteOpen = !ui.paletteOpen;
		} else if (e.key === 'Escape' && ui.paletteOpen) {
			ui.paletteOpen = false;
		}
	}

	function onListKey(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			active = (active + 1) % Math.max(results.length, 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			active = (active - 1 + results.length) % Math.max(results.length, 1);
		} else if (e.key === 'Enter' && results[active]) {
			run(results[active]);
		}
	}
</script>

<svelte:window onkeydown={onGlobalKey} />

{#if ui.paletteOpen}
	<div class="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh]">
		<button
			type="button"
			class="absolute inset-0 bg-black/60 backdrop-blur-sm"
			aria-label="Close command palette"
			onclick={() => (ui.paletteOpen = false)}
		></button>

		<div
			class="panel edge-light relative w-full max-w-lg overflow-hidden !bg-[#0d0d11]/95"
			role="dialog"
			aria-modal="true"
			aria-label="Command palette"
		>
			<div class="flex items-center gap-3 border-b border-white/[0.06] px-4">
				<span class="mono text-cyan-glow">❯</span>
				<input
					bind:this={input}
					bind:value={query}
					oninput={() => (active = 0)}
					onkeydown={onListKey}
					placeholder="Type a command or search…"
					class="mono h-12 w-full border-0 bg-transparent p-0 text-sm text-white placeholder:text-ink-faint focus:ring-0 focus-visible:outline-none"
					aria-controls="palette-list"
					aria-activedescendant={results[active] ? `cmd-${active}` : undefined}
				/>
				<kbd>esc</kbd>
			</div>

			<ul id="palette-list" class="max-h-80 overflow-y-auto p-2" role="listbox">
				{#each results as c, i (c.label)}
					{#if i === 0 || results[i - 1].group !== c.group}
						<li class="eyebrow px-2.5 pb-1 pt-2.5 !text-[10px]" role="presentation">{c.group}</li>
					{/if}
					<li
						id="cmd-{i}"
						role="option"
						aria-selected={i === active}
						class="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors {i ===
						active
							? 'bg-white/[0.06] text-white'
							: 'text-ink-muted'}"
						onmouseenter={() => (active = i)}
						onclick={() => run(c)}
						onkeydown={() => {}}
					>
						<span>{c.label === 'Copy email address' && copied ? 'Copied ✓' : c.label}</span>
						<span class="mono text-[11px] text-ink-faint">{c.hint}</span>
					</li>
				{:else}
					<li class="mono px-3 py-6 text-center text-xs text-ink-faint">
						command not found: {query}
					</li>
				{/each}
			</ul>

			<div
				class="mono flex items-center gap-3 border-t border-white/[0.06] px-4 py-2 text-[10.5px] text-ink-faint"
			>
				<span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
				<span><kbd>↵</kbd> run</span>
				<span class="ml-auto">nanwp.com</span>
			</div>
		</div>
	</div>
{/if}
