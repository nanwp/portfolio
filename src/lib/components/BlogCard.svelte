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

<a href="/blog/{blog.slug}" class="group block h-full no-underline">
	<article class="glass-card-hover flex h-full flex-col overflow-hidden">
		<!-- cover: the post's tags drawn as a small pipeline, same language as the case-study diagrams -->
		<div
			class="dot-grid relative flex h-28 items-center justify-center border-b border-white/[0.06] px-5"
		>
			<span
				class="mono absolute right-4 top-3 text-[10px] text-ink-faint transition-colors group-hover:text-cyan-glow"
				>cat ↗</span
			>
			<div class="mono flex items-center text-[10.5px]">
				{#each blog.tags.slice(0, 3) as tag, i}
					{#if i > 0}
						<span class="h-px w-5 bg-white/15 transition-colors group-hover:bg-cyan-glow/50 sm:w-7"
						></span>
					{/if}
					<span
						class="rounded-md border bg-black/40 px-2 py-1 transition-colors {i === 0
							? 'border-cyan-glow/40 text-cyan-glow'
							: 'border-white/15 text-ink-muted group-hover:border-white/25'}">{tag}</span
					>
				{/each}
				{#if blog.tags.length > 3}
					<span class="ml-2 text-ink-faint">+{blog.tags.length - 3}</span>
				{/if}
			</div>
		</div>
		<div class="flex flex-1 flex-col p-5">
			<div class="mono mb-2 flex items-center gap-3 text-[11px] text-ink-faint">
				<time>{formatDate(blog.date)}</time>
				<span>&middot;</span>
				<span>{readingTime(blog.content)} min read</span>
			</div>
			<h3
				class="text-lg font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-cyan-glow"
			>
				{blog.title}
			</h3>
			<p class="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{blog.excerpt}</p>
		</div>
	</article>
</a>
