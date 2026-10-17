<script lang="ts">
	let {
		experience,
		isLast = false
	}: {
		experience: {
			company: string;
			role: string;
			date: string;
			location: string;
			context?: string;
			description: string[];
			tags: string[];
		};
		isLast?: boolean;
	} = $props();

	let expanded = $state(false);
	const previewCount = 3;

	// Numbers are what recruiters scan for: "95%", "5s to 100ms", "10 payment … microservices".
	const METRIC =
		/(\d+(?:–\d+)?\s?(?:%|ms\b|s\b|days|hours)(?: to \d+(?:–\d+)?\s?(?:ms\b|s\b|hours))?|\b\d+ (?:payment|peer)\b[^,;(]*)/;
	const segments = (text: string) => text.split(METRIC);
</script>

<div class="relative pl-8 pb-8 {isLast ? '' : 'border-l border-white/[0.08]'} ml-3">
	<!-- Timeline dot -->
	<div
		class="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-glow border-[3px] border-obsidian z-10"
	>
		{#if !isLast}
			<div
				class="absolute inset-0 rounded-full bg-cyan-glow/30 animate-ping motion-reduce:hidden"
				style="animation-duration: 3s;"
			></div>
		{/if}
	</div>

	<div class="panel p-5 ml-4">
		<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
			<div>
				<h3 class="text-base font-semibold text-white">{experience.role}</h3>
				<p class="mono text-xs text-cyan-glow/80 mt-0.5">{experience.company}</p>
				{#if experience.context}
					<p class="mt-1 text-xs italic text-ink-faint">{experience.context}</p>
				{/if}
			</div>
			<div class="flex items-center gap-2 mono text-[11px] text-ink-faint shrink-0">
				<span>{experience.date}</span>
				<span class="hidden sm:inline">&middot;</span>
				<span class="hidden sm:inline">{experience.location}</span>
			</div>
		</div>

		<ul class="space-y-2 text-sm text-ink-muted leading-relaxed">
			{#each expanded ? experience.description : experience.description.slice(0, previewCount) as item}
				<li class="flex gap-2">
					<span class="text-cyan-glow/50 mt-1.5 shrink-0">
						<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 8 8"
							><circle cx="4" cy="4" r="3" /></svg
						>
					</span>
					<span>
						{#each segments(item) as seg, i}
							{#if i % 2}<strong class="font-medium text-white">{seg}</strong>{:else}{seg}{/if}
						{/each}
					</span>
				</li>
			{/each}
		</ul>

		{#if experience.description.length > previewCount}
			<button
				onclick={() => (expanded = !expanded)}
				class="mt-3 text-xs mono text-ink-faint hover:text-white transition-colors cursor-pointer"
			>
				{expanded ? 'Show less' : `Show ${experience.description.length - previewCount} more...`}
			</button>
		{/if}

		<div class="mt-3 flex flex-wrap gap-1.5">
			{#each experience.tags as tag}
				<span class="tag">{tag}</span>
			{/each}
		</div>
	</div>
</div>
