<script lang="ts">
	import { page } from '$app/stores';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let mobileOpen = $state(false);

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/#about', label: 'About' },
		{ href: '/#experience', label: 'Experience' },
		{ href: '/#projects', label: 'Projects' },
		{ href: '/blog', label: 'Blog' },
	];

	function closeMobile() {
		mobileOpen = false;
	}

	function isActive(href: string): boolean {
		const path = $page.url.pathname;
		if (href === '/') return path === '/';
		if (href.startsWith('/#')) return path === '/';
		return path.startsWith(href);
	}
</script>

<header
	class="sticky top-0 z-50 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.06]"
>
	<nav class="container mx-auto px-6 py-4 flex items-center justify-between">
		<a
			href="/"
			class="text-lg font-bold tracking-tight text-slate-900 no-underline hover:text-slate-900 dark:text-white dark:hover:text-white group flex items-center gap-2"
		>
			<span
				class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-indigo-500/20"
				>N</span
			>
			<span class="hidden sm:inline">Nanda Wijaya Putra<span class="text-indigo-600 dark:text-indigo-400">.</span></span>
		</a>

		<div class="hidden md:flex items-center gap-1">
			{#each navLinks as link}
				<a
					href={link.href}
					class="px-3 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-200
						{isActive(link.href)
							? 'text-slate-900 bg-slate-100 dark:text-white dark:bg-white/[0.08]'
							: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.05]'}"
				>
					{link.label}
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-2 sm:gap-3">
			<ThemeToggle />
			<button
				type="button"
				onclick={() => (mobileOpen = !mobileOpen)}
				class="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-gray-300"
				aria-label="Toggle menu"
			>
				{#if mobileOpen}
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				{/if}
			</button>
		</div>
	</nav>

	<div class="gradient-line"></div>

	{#if mobileOpen}
		<div
			class="md:hidden border-t border-slate-200/80 dark:border-white/[0.06] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl"
		>
			<div class="container mx-auto px-6 py-4 flex flex-col gap-1">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={closeMobile}
						class="px-4 py-3 rounded-lg text-sm font-medium no-underline transition-all duration-200
							{isActive(link.href)
								? 'text-slate-900 bg-slate-100 dark:text-white dark:bg-white/[0.08]'
								: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.05]'}"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</header>
