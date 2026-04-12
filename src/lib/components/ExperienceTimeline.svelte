<script lang="ts">
	let { experience, isLast = false }: {
		experience: {
			company: string;
			role: string;
			date: string;
			location: string;
			description: string[];
			tags: string[];
		};
		isLast?: boolean;
	} = $props();

	let expanded = $state(false);
	const previewCount = 2;
</script>

<div class="relative pl-8 pb-8 {isLast ? '' : 'border-l border-slate-200 dark:border-white/[0.08]'} ml-3">
	<!-- Timeline dot -->
	<div class="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border-[3px] border-white dark:border-[#0f172a] z-10">
		{#if !isLast}
			<div class="absolute inset-0 rounded-full bg-indigo-400/40 animate-ping" style="animation-duration: 3s;"></div>
		{/if}
	</div>

	<div class="glass-card p-5 ml-4">
		<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
			<div>
				<h3 class="text-base font-semibold text-slate-900 dark:text-white">{experience.role}</h3>
				<p class="text-sm text-indigo-600 dark:text-indigo-400">{experience.company}</p>
			</div>
			<div class="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-500 shrink-0">
				<span>{experience.date}</span>
				<span class="hidden sm:inline">&middot;</span>
				<span class="hidden sm:inline">{experience.location}</span>
			</div>
		</div>

		<ul class="space-y-2 text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
			{#each expanded ? experience.description : experience.description.slice(0, previewCount) as item}
				<li class="flex gap-2">
					<span class="text-indigo-400/60 mt-1.5 shrink-0">
						<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"/></svg>
					</span>
					<span>{item}</span>
				</li>
			{/each}
		</ul>

		{#if experience.description.length > previewCount}
			<button
				onclick={() => expanded = !expanded}
				class="mt-3 text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
			>
				{expanded ? 'Show less' : `Show ${experience.description.length - previewCount} more...`}
			</button>
		{/if}

		<div class="mt-3 flex flex-wrap gap-1.5">
			{#each experience.tags as tag}
				<span class="badge text-[10px] px-2 py-0.5">{tag}</span>
			{/each}
		</div>
	</div>
</div>
