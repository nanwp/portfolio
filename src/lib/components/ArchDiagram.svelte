<script lang="ts">
	import type { CaseStudy, DiagramKind } from '$lib/data/caseStudies';

	let { diagram, active = false }: { diagram: CaseStudy['diagram']; active?: boolean } = $props();

	const stroke: Record<DiagramKind, string> = {
		client: 'rgba(255,255,255,0.28)',
		service: 'rgba(0,240,255,0.55)',
		broker: 'rgba(16,185,129,0.6)',
		store: 'rgba(16,185,129,0.45)',
		infra: 'rgba(201,204,212,0.35)',
		obs: 'rgba(250,204,21,0.45)'
	};

	// node x/y are centres; edges run left → right between node edges
	const byId = $derived(Object.fromEntries(diagram.nodes.map((n) => [n.id, n])));
	const W = 62;
	const H = 20;
</script>

<svg viewBox="-4 22 330 136" class="h-auto w-full" role="img" aria-label="Architecture diagram">
	{#each diagram.edges as [from, to], i}
		{@const a = byId[from]}
		{@const b = byId[to]}
		{@const x1 = a.x + W / 2}
		{@const x2 = b.x - W / 2}
		{@const d = `M${x1} ${a.y} C ${(x1 + x2) / 2} ${a.y}, ${(x1 + x2) / 2} ${b.y}, ${x2} ${b.y}`}
		<path {d} fill="none" stroke="rgba(255,255,255,0.1)" />
		<path
			{d}
			class="flow"
			class:active
			style="animation-delay: {-i * 0.4}s"
			fill="none"
			stroke={i % 2 ? '#10B981' : '#00F0FF'}
			stroke-width="1.6"
			stroke-linecap="round"
			pathLength="100"
		/>
	{/each}
	{#each diagram.nodes as n}
		<g transform="translate({n.x - W / 2} {n.y - H / 2})">
			<rect width={W} height={H} rx="4" fill="#0e0f13" stroke={stroke[n.kind]} />
			<text x={W / 2} y={H / 2 + 3} text-anchor="middle" class="label">{n.label}</text>
		</g>
	{/each}
</svg>

<style>
	.label {
		font-family: var(--font-mono);
		font-size: 7.5px;
		fill: #b7bbc6;
	}
	.flow {
		stroke-dasharray: 3 97;
		opacity: 0.35;
		animation: flow 2.8s linear infinite;
		transition: opacity 0.3s;
	}
	.flow.active {
		opacity: 1;
		animation-duration: 1.6s;
	}
	@keyframes flow {
		from {
			stroke-dashoffset: 100;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.flow {
			animation: none;
			opacity: 0;
		}
	}
</style>
