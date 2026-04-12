<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	let { data } = $props();
	let copied = $state(false);

	const blog = data.blog;
	const related = data.related;

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function readingTime(html: string): number {
		const text = html.replace(/<[^>]*>/g, '');
		const words = text.split(/\s+/).length;
		return Math.max(1, Math.ceil(words / 200));
	}

	async function copyLink() {
		await navigator.clipboard.writeText(window.location.href);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head>
	<title>{blog.title} — Nanda Wijaya Putra</title>
	<meta name="description" content={blog.excerpt} />
</svelte:head>

<article class="relative">
	<div class="absolute inset-0 bg-gradient-to-b from-indigo-500/8 via-transparent to-transparent dark:from-indigo-500/[0.04] pointer-events-none h-[400px]"></div>

	<div class="container mx-auto px-6 pt-16 pb-20 relative">
		<!-- Back link -->
		<ScrollReveal>
			<a href="/blog" class="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:text-gray-500 dark:hover:text-gray-300 no-underline mb-10">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
				</svg>
				Back to blog
			</a>
		</ScrollReveal>

		<!-- Header -->
		<ScrollReveal>
			<header class="max-w-3xl mx-auto mb-12">
				<div class="flex flex-wrap gap-2 mb-4">
					{#each blog.tags as tag}
						<span class="badge-primary text-[10px]">{tag}</span>
					{/each}
				</div>

				<h1 class="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
					{blog.title}
				</h1>

				<div class="flex items-center gap-4 text-sm text-slate-500 dark:text-gray-500">
					<div class="flex items-center gap-2">
						<div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">N</div>
						<span class="text-slate-700 dark:text-gray-400">Nanda Wijaya Putra</span>
					</div>
					<span>&middot;</span>
					<time>{formatDate(blog.date)}</time>
					<span>&middot;</span>
					<span>{readingTime(blog.content)} min read</span>
				</div>
			</header>
		</ScrollReveal>

		<!-- Content -->
		<ScrollReveal>
			<div class="max-w-3xl mx-auto">
				<div class="prose-custom">
					{@html blog.content}
				</div>
			</div>
		</ScrollReveal>

		<!-- Share / actions -->
		<ScrollReveal>
			<div class="max-w-3xl mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-white/[0.06]">
				<div class="flex items-center justify-between">
					<div class="flex flex-wrap gap-2">
						{#each blog.tags as tag}
							<a href="/blog?tag={tag}" class="badge text-[10px] no-underline hover:bg-slate-100 dark:hover:bg-white/10">{tag}</a>
						{/each}
					</div>
					<button type="button" onclick={copyLink} class="btn-ghost text-xs cursor-pointer">
						{#if copied}
							<svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
							</svg>
							Copied!
						{:else}
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-4.758a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.5 8.688" />
							</svg>
							Copy link
						{/if}
					</button>
				</div>
			</div>
		</ScrollReveal>

		<!-- Related posts -->
		{#if related.length > 0}
			<ScrollReveal>
				<div class="max-w-3xl mx-auto mt-16">
					<h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Related Posts</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each related as post}
							<BlogCard blog={post} />
						{/each}
					</div>
				</div>
			</ScrollReveal>
		{/if}
	</div>
</article>
