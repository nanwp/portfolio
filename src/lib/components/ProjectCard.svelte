<script lang="ts">
	let { project }: {
		project: {
			name: string;
			subtitle: string;
			url: string;
			description: string;
			tags: string[];
			featured: boolean;
		};
	} = $props();
</script>

<a href={project.url} target="_blank" rel="noopener" class="group block no-underline">
	<article class="glass-card-hover p-6 h-full flex flex-col">
		<div class="flex items-start justify-between mb-3">
			<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-300/60 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:border-indigo-500/50 dark:group-hover:border-indigo-400/40 transition-colors">
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
				</svg>
			</div>
			<svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:text-gray-600 dark:group-hover:text-gray-400 transition-colors -translate-y-0.5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
			</svg>
		</div>

		<h3 class="text-base font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300 transition-colors">{project.name}</h3>
		<p class="text-xs text-slate-500 dark:text-gray-500 mt-0.5 mb-3">{project.subtitle}</p>
		<p class="text-sm text-slate-600 dark:text-gray-400 leading-relaxed flex-1">{project.description}</p>

		<div class="mt-4 flex flex-wrap gap-1.5">
			{#each project.tags as tag}
				<span class="badge-primary text-[10px] px-2 py-0.5">{tag}</span>
			{/each}
		</div>
	</article>
</a>
