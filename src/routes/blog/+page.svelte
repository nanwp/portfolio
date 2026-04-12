<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import BlogCard from '$lib/components/BlogCard.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	let { data } = $props();

	let search = $state('');

	const activeTag = $derived($page.url.searchParams.get('tag') ?? '');

	const allTags = [...new Set(data.posts.flatMap((b) => b.tags))].sort();

	const filtered = $derived(
		data.posts.filter((b) => {
			const matchSearch =
				!search ||
				b.title.toLowerCase().includes(search.toLowerCase()) ||
				b.excerpt.toLowerCase().includes(search.toLowerCase());
			const matchTag = !activeTag || b.tags.includes(activeTag);
			return matchSearch && matchTag;
		})
	);

	function setTag(tag: string) {
		const u = new URL($page.url.href);
		if (tag) u.searchParams.set('tag', tag);
		else u.searchParams.delete('tag');
		goto(`${u.pathname}${u.search}`, { replaceState: true, keepFocus: true, noScroll: true });
	}

	function toggleTag(tag: string) {
		setTag(activeTag === tag ? '' : tag);
	}
</script>

<svelte:head>
	<title>Blog — Nanda Wijaya Putra</title>
	<meta name="description" content="Writings on software engineering, backend development, and cloud architecture." />
</svelte:head>

<section class="relative overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent dark:from-violet-500/[0.05] pointer-events-none"></div>

	<div class="container mx-auto px-6 pt-20 pb-12 relative">
		<ScrollReveal>
			<div class="text-center mb-12">
				<h1 class="text-4xl md:text-5xl font-black tracking-tight mb-4">
					<span class="gradient-text">Blog</span>
				</h1>
				<p class="text-slate-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
					Thoughts, tutorials, and lessons learned from building production systems.
				</p>
			</div>
		</ScrollReveal>

		<ScrollReveal>
			<div class="max-w-2xl mx-auto mb-10">
				<div class="relative">
					<svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
					</svg>
					<input
						type="text"
						placeholder="Search articles..."
						bind:value={search}
						class="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200
						       text-slate-900 placeholder:text-slate-400 text-sm
						       dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-gray-200 dark:placeholder:text-gray-600
						       focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/20
						       dark:focus:border-indigo-500/40 transition-all duration-200"
					/>
				</div>
			</div>
		</ScrollReveal>

		<ScrollReveal>
			<div class="flex flex-wrap justify-center gap-2 mb-12">
				<button
					type="button"
					onclick={() => setTag('')}
					class="badge cursor-pointer transition-all duration-200 {!activeTag ? 'bg-indigo-100 text-indigo-800 ring-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-indigo-400/30' : 'hover:bg-slate-100 dark:hover:bg-white/10'}"
				>
					All
				</button>
				{#each allTags as tag}
					<button
						type="button"
						onclick={() => toggleTag(tag)}
						class="badge cursor-pointer transition-all duration-200 {activeTag === tag ? 'bg-indigo-100 text-indigo-800 ring-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-indigo-400/30' : 'hover:bg-slate-100 dark:hover:bg-white/10'}"
					>
						{tag}
					</button>
				{/each}
			</div>
		</ScrollReveal>

		{#if filtered.length === 0}
			<div class="text-center py-20">
				<p class="text-slate-600 dark:text-gray-500 text-lg">No articles found.</p>
				<button type="button" onclick={() => { search = ''; setTag(''); }} class="btn-ghost text-sm mt-4">
					Clear filters
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{#each filtered as blog}
					<ScrollReveal>
						<BlogCard {blog} />
					</ScrollReveal>
				{/each}
			</div>
		{/if}
	</div>
</section>
