<script lang="ts">
	import { caseStudies, type CaseStudy } from '$lib/data/caseStudies';
	import projects from '$lib/data/projects.json';
	import { sceneRef } from '$lib/stores/ui.svelte';
	import ArchDiagram from './ArchDiagram.svelte';

	let hovered = $state<number | null>(null);
	let selected = $state<CaseStudy | null>(null);
	let dialog = $state<HTMLDialogElement>();

	const oss = projects.filter((p) => p.url.includes('github.com'));

	function focus(i: number | null) {
		hovered = i;
		sceneRef.current?.setFocus(i);
	}

	function openStudy(cs: CaseStudy) {
		selected = cs;
		dialog?.showModal();
	}
</script>

<section id="work" data-stage="work" class="relative scroll-mt-24 py-20 sm:py-24">
	<div class="container mx-auto px-4 sm:px-6">
		<div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
			<div class="max-w-xl">
				<p class="eyebrow mb-4">03 / Engineering Case Studies</p>
				<h2 class="section-title text-white">Systems, not screenshots.</h2>
				<p class="mt-5 leading-relaxed text-ink-muted">
					Each one is anchored to a node in the cluster. Open a case for the problem, the design,
					and what it changed.
				</p>
			</div>
		</div>

		<div class="mt-12 grid gap-3 md:grid-cols-2">
			{#each caseStudies as cs, i (cs.id)}
				<button
					type="button"
					class="panel edge-light group flex flex-col p-5 text-left transition-colors hover:border-white/[0.14] sm:p-6 {cs.featured
						? 'md:col-span-2 lg:grid lg:grid-cols-[1fr_1.15fr] lg:content-start lg:gap-x-10 lg:p-8'
						: ''}"
					onpointerenter={() => focus(i)}
					onpointerleave={() => focus(null)}
					onfocus={() => focus(i)}
					onblur={() => focus(null)}
					onclick={() => openStudy(cs)}
				>
					<div class="flex items-start justify-between gap-4">
						<div>
							<p class="mono flex flex-wrap items-center gap-x-2 text-[10.5px] text-ink-faint">
								<span>node/{String(i + 1).padStart(2, '0')} · {cs.org} · {cs.period}</span>
								{#if cs.links?.length}
									<span class="flex items-center gap-1.5 text-emerald-300"
										><span class="status-dot"></span>live</span
									>
								{/if}
							</p>
							<h3
								class="mt-1.5 font-semibold tracking-tight text-white {cs.featured
									? 'text-xl sm:text-2xl'
									: 'text-lg'}"
							>
								{cs.title}
							</h3>
							{#if cs.featured}
								<p class="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">{cs.summary}</p>
							{/if}
						</div>
						<span
							class="mono shrink-0 rounded-md border border-white/10 px-2 py-1 text-[10.5px] text-ink-muted transition-colors group-hover:border-cyan-glow/40 group-hover:text-cyan-glow"
						>
							deep dive ↗
						</span>
					</div>

					<div
						class="mt-4 rounded-xl border border-white/[0.05] bg-black/30 p-3 {cs.featured
							? 'lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:self-center'
							: ''}"
					>
						<ArchDiagram diagram={cs.diagram} active={hovered === i} />
					</div>

					<dl class="mt-4 grid grid-cols-3 gap-2">
						{#each cs.metrics as m}
							<div>
								<dd class="mono text-sm font-semibold text-white sm:text-base">{m.value}</dd>
								<dt class="mt-0.5 text-[11px] leading-snug text-ink-faint">{m.label}</dt>
							</div>
						{/each}
					</dl>

					<div class="mt-5 flex flex-wrap gap-1.5">
						{#each cs.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				</button>
			{/each}
		</div>

		{#if oss.length}
			<div class="mt-3 grid gap-3">
				{#each oss as p}
					<a
						href={p.url}
						target="_blank"
						rel="noopener"
						class="panel group flex flex-col gap-4 px-5 py-5 no-underline transition-colors hover:border-white/[0.14] sm:flex-row sm:items-center sm:justify-between sm:px-6"
					>
						<span class="min-w-0">
							<span class="mono text-[10.5px] text-ink-faint">open source · {p.subtitle}</span>
							<span class="mt-1 block text-lg font-semibold tracking-tight text-white"
								>{p.name}</span
							>
							<span class="mt-1.5 block max-w-2xl text-sm leading-relaxed text-ink-muted"
								>{p.description}</span
							>
						</span>
						<span class="flex shrink-0 flex-wrap items-center gap-1.5">
							{#each p.tags.filter((t) => t !== 'Open Source') as tag}
								<span class="tag">{tag}</span>
							{/each}
							<span
								class="mono ml-1 rounded-md border border-white/10 px-2 py-1 text-[10.5px] text-ink-muted transition-colors group-hover:border-cyan-glow/40 group-hover:text-cyan-glow"
								>github ↗</span
							>
						</span>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<dialog
	bind:this={dialog}
	onclose={() => (selected = null)}
	onclick={(e) => e.target === dialog && dialog?.close()}
	class="m-auto w-[min(100%-2rem,46rem)] max-h-[88vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0c10] p-0 text-ink backdrop:bg-black/70 backdrop:backdrop-blur-sm"
>
	{#if selected}
		<article class="p-6 sm:p-8">
			<header class="flex items-start justify-between gap-4">
				<div>
					<p class="mono text-[11px] text-ink-faint">{selected.org} · {selected.period}</p>
					<h3 class="mt-1 text-2xl font-semibold tracking-tight text-white">{selected.title}</h3>
				</div>
				<button
					type="button"
					class="mono rounded-md border border-white/10 px-2 py-1 text-xs text-ink-muted hover:text-white"
					onclick={() => dialog?.close()}
				>
					esc
				</button>
			</header>

			<p class="mt-4 leading-relaxed text-ink-muted">{selected.summary}</p>

			<div class="mt-6 rounded-xl border border-white/[0.06] bg-black/40 p-4">
				<ArchDiagram diagram={selected.diagram} active />
			</div>

			<dl class="mt-6 grid grid-cols-3 gap-3">
				{#each selected.metrics as m}
					<div class="rounded-xl border border-white/[0.06] p-3">
						<dd class="mono text-base font-semibold text-cyan-glow">{m.value}</dd>
						<dt class="mt-1 text-xs text-ink-faint">{m.label}</dt>
					</div>
				{/each}
			</dl>

			<div class="mt-8 space-y-6 text-[15px] leading-relaxed">
				<section>
					<h4 class="eyebrow mb-2">Problem</h4>
					<p class="text-ink-muted">{selected.problem}</p>
				</section>
				<section>
					<h4 class="eyebrow mb-2">Design</h4>
					<ul class="space-y-2">
						{#each selected.approach as a}
							<li class="flex gap-3 text-ink-muted">
								<span class="mono text-cyan-glow">→</span>{a}
							</li>
						{/each}
					</ul>
				</section>
				<section>
					<h4 class="eyebrow mb-2">Outcome</h4>
					<ul class="space-y-2">
						{#each selected.outcome as o}
							<li class="flex gap-3 text-ink"><span class="mono text-emerald-glow">✓</span>{o}</li>
						{/each}
					</ul>
				</section>
			</div>

			<div class="mt-8 flex flex-wrap items-center gap-2">
				{#each selected.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
			{#if selected.links?.length}
				<div class="mt-4 flex flex-wrap gap-2">
					{#each selected.links as l}
						<a
							href={l.href}
							class="btn-mono !h-9 text-xs"
							target={l.href.startsWith('http') ? '_blank' : undefined}
							rel="noopener">{l.label} ↗</a
						>
					{/each}
				</div>
			{/if}
		</article>
	{/if}
</dialog>
