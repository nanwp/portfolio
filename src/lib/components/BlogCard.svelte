<script lang="ts">
	import type { BlogPost } from '$lib/blog/loadPosts';

	let { blog }: { blog: BlogPost } = $props();

	const coverColor = $derived(blog.coverColor ?? 'from-indigo-500 to-violet-500');

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
</script>

<a href="/blog/{blog.slug}" class="group block no-underline">
	<article class="glass-card-hover overflow-hidden h-full flex flex-col">
		<div class="h-32 bg-gradient-to-br {coverColor} opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
			<h3 class="text-lg font-bold text-white leading-snug drop-shadow-lg">{blog.title}</h3>
		</div>
		<div class="p-5 flex flex-col flex-1">
			<div class="flex items-center gap-3 text-xs text-slate-500 dark:text-gray-500 mb-3">
				<time>{formatDate(blog.date)}</time>
				<span>&middot;</span>
				<span>{readingTime(blog.content)} min read</span>
			</div>
			<p class="text-sm text-slate-600 dark:text-gray-400 leading-relaxed flex-1">{blog.excerpt}</p>
			<div class="mt-4 flex flex-wrap gap-1.5">
				{#each blog.tags as tag}
					<span class="badge text-[10px] px-2 py-0.5">{tag}</span>
				{/each}
			</div>
		</div>
	</article>
</a>
