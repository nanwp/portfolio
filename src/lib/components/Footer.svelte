<script lang="ts">
	import { onMount } from 'svelte';
	import Terminal from './Terminal.svelte';
	import { profile } from '$lib/data/profile';

	let time = $state('--:--:--');

	onMount(() => {
		const fmt = new Intl.DateTimeFormat('en-GB', {
			timeZone: 'Asia/Jakarta',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});
		const update = () => (time = fmt.format(new Date()));
		update();
		const id = setInterval(update, 1000);
		return () => clearInterval(id);
	});

	const socials = [
		{ label: 'GitHub', href: 'https://github.com/nanwp', handle: '@nanwp' },
		{ label: 'LinkedIn', href: 'https://linkedin.com/in/nanwp', handle: 'in/nanwp' },
		{ label: 'Medium', href: 'https://medium.com/@nanwp', handle: '@nanwp' },
		{ label: 'Email', href: 'mailto:nanwp.dev@gmail.com', handle: 'nanwp.dev@gmail.com' }
	];
</script>

<footer id="contact" class="relative scroll-mt-24 border-t border-white/[0.06]">
	<div class="container mx-auto grid gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
		<div>
			<p class="eyebrow mb-4">06 / Contact</p>
			<h2 class="section-title text-white">Let's build something that stays up.</h2>
			<p class="mt-5 max-w-md leading-relaxed text-ink-muted">
				Looking for backend, platform or cloud infrastructure roles: payments, distributed systems
				and observability are where I do my best work.
			</p>

			<div class="panel mt-8 max-w-md p-4">
				<p class="flex items-center gap-2 text-sm text-white">
					<span class="status-dot"></span>
					{profile.availability}
				</p>
				<div class="mt-3 flex flex-wrap gap-1.5">
					<span class="badge-accent">Remote</span>
					{#each profile.relocation as r}
						<span class="tag">{r}</span>
					{/each}
				</div>
			</div>

			<div class="mt-6 flex flex-wrap gap-3">
				<a href="mailto:{profile.email}" class="btn-glow">{profile.email}</a>
				<a href={profile.resumeUrl} class="btn-mono" download>Download CV (PDF) ↓</a>
			</div>

			<ul
				class="mono mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06] text-[12.5px]"
			>
				{#each socials as s}
					<li>
						<a
							href={s.href}
							target={s.href.startsWith('http') ? '_blank' : undefined}
							rel="noopener"
							class="flex items-center justify-between py-3 text-ink-muted no-underline hover:text-white"
						>
							<span>{s.label}</span>
							<span class="text-ink-faint">{s.handle} ↗</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex flex-col gap-4">
			<Terminal />
			<p class="mono text-[11px] text-ink-faint">
				commands: <span class="text-ink-muted">whoami · cv · stack · ping nanwp.com · contact</span>
			</p>
		</div>
	</div>

	<div class="border-t border-white/[0.06]">
		<div
			class="mono container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-[11px] text-ink-faint sm:flex-row sm:px-6"
		>
			<span>© {new Date().getFullYear()} Nanda Wijaya Putra</span>
			<span class="flex items-center gap-2">
				<span class="status-dot"></span>
				Jakarta <span class="tabular-nums text-ink-muted">{time}</span> UTC+7
			</span>
			<span>SvelteKit · Three.js · GSAP</span>
		</div>
	</div>
</footer>
