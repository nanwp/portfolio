<script lang="ts">
	import type { BlogPost } from '$lib/blog/loadPosts';

	let { blog }: { blog: BlogPost } = $props();

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
		<div class="dot-grid relative flex h-32 items-end border-b border-white/[0.06] p-5">
			<span
				class="mono absolute right-4 top-4 text-[10px] text-ink-faint transition-colors group-hover:text-cyan-glow"
				>cat ↗</span
			>
			<h3 class="text-lg font-semibold leading-snug tracking-tight text-white">{blog.title}</h3>
		</div>
		<div class="p-5 flex flex-col flex-1">
			<div class="mono mb-3 flex items-center gap-3 text-[11px] text-ink-faint">
				<time>{formatDate(blog.date)}</time>
				<span>&middot;</span>
				<span>{readingTime(blog.content)} min read</span>
			</div>
			<p class="flex-1 text-sm leading-relaxed text-ink-muted">{blog.excerpt}</p>
			<div class="mt-4 flex flex-wrap gap-1.5">
				{#each blog.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
		</div>
	</article>
</a>
