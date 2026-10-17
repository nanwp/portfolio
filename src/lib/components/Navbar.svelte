<script lang="ts">
	import { ui } from '$lib/stores/ui.svelte';

	const links = [
		{ href: '/#architecture', label: 'Architecture' },
		{ href: '/#work', label: 'Work' },
		{ href: '/#telemetry', label: 'Telemetry' },
		{ href: '/#contact', label: 'Contact' }
	];

	let scrolled = $state(false);
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 24)} />

<header class="fixed inset-x-0 top-3 z-50 flex justify-center px-4 sm:top-4">
	<nav
		class="flex w-full max-w-4xl items-center justify-between gap-2 rounded-full border border-white/[0.08] py-1.5 pl-4 pr-1.5 backdrop-blur-md transition-colors duration-300 {scrolled
			? 'bg-[#0b0b0f]/80'
			: 'bg-[#0b0b0f]/40'}"
		aria-label="Primary"
	>
		<a href="/" class="flex min-w-0 items-center gap-2.5 text-white no-underline hover:text-white">
			<span class="mono text-sm font-semibold tracking-tight"
				>nanwp<span class="text-cyan-glow">.</span>com</span
			>
			<span class="hidden items-center gap-1.5 border-l border-white/10 pl-2.5 lg:flex">
				<span class="status-dot"></span>
				<span class="mono whitespace-nowrap text-[10.5px] text-ink-muted"
					>System Operational • 99.99%</span
				>
			</span>
		</a>

		<div class="flex items-center gap-0.5">
			{#each links as link}
				<a
					href={link.href}
					class="hidden rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-muted no-underline transition-colors hover:bg-white/[0.05] hover:text-white md:block"
				>
					{link.label}
				</a>
			{/each}
			<a
				href="/Nanda_Wijaya_Putra_CV.pdf"
				download
				class="ml-1 hidden rounded-full border border-cyan-glow/30 bg-cyan-glow/[0.06] px-3 py-1.5 text-[12px] font-medium text-cyan-200 no-underline transition-colors hover:border-cyan-glow/60 hover:text-white sm:block"
			>
				Resume ↓
			</a>
			<button
				type="button"
				onclick={() => (ui.paletteOpen = true)}
				class="ml-1 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-ink-muted transition-colors hover:border-white/20 hover:text-white"
				aria-label="Open command palette"
			>
				<svg
					class="h-3.5 w-3.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="m4 17 6-6-6-6M12 19h8" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				<span class="mono hidden sm:inline">⌘K</span>
				<span class="mono sm:hidden">menu</span>
			</button>
		</div>
	</nav>
</header>
