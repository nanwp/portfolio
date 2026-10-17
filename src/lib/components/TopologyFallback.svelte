<script lang="ts">
	// Lightweight SVG stand-in for the WebGL scene on phones, save-data, or no-WebGL.
	// Packets are CSS dash animations, so they stop under prefers-reduced-motion.
	const nodes = [
		{ x: 200, y: 160 },
		{ x: 90, y: 90 },
		{ x: 320, y: 80 },
		{ x: 60, y: 230 },
		{ x: 330, y: 250 },
		{ x: 200, y: 40 },
		{ x: 140, y: 300 },
		{ x: 270, y: 320 }
	];
	const links: [number, number][] = [
		[0, 1],
		[0, 2],
		[0, 3],
		[0, 4],
		[1, 5],
		[2, 5],
		[3, 6],
		[4, 7],
		[6, 7],
		[1, 3],
		[2, 4]
	];
</script>

<svg
	class="absolute right-[-15%] top-[8%] h-[70vh] w-auto opacity-40"
	viewBox="0 0 400 360"
	fill="none"
>
	<defs>
		<radialGradient id="core-glow">
			<stop offset="0" stop-color="#00F0FF" stop-opacity="0.35" />
			<stop offset="1" stop-color="#00F0FF" stop-opacity="0" />
		</radialGradient>
	</defs>
	<circle cx="200" cy="160" r="90" fill="url(#core-glow)" />
	{#each links as [a, b], i}
		{@const A = nodes[a]}
		{@const B = nodes[b]}
		<path
			d="M{A.x} {A.y} Q {(A.x + B.x) / 2} {(A.y + B.y) / 2 - 30} {B.x} {B.y}"
			stroke="rgba(0,240,255,0.18)"
		/>
		<path
			class="packet"
			style="animation-delay: {-i * 0.37}s"
			d="M{A.x} {A.y} Q {(A.x + B.x) / 2} {(A.y + B.y) / 2 - 30} {B.x} {B.y}"
			stroke={i % 3 ? '#00F0FF' : '#10B981'}
			stroke-width="2"
			stroke-linecap="round"
			pathLength="100"
		/>
	{/each}
	{#each nodes as n, i}
		<rect
			x={n.x - (i ? 9 : 22)}
			y={n.y - (i ? 9 : 14)}
			width={i ? 18 : 44}
			height={i ? 18 : 28}
			rx="4"
			fill="#15161c"
			stroke="rgba(255,255,255,0.18)"
		/>
		<circle cx={n.x} cy={n.y - (i ? 13 : 19)} r="1.6" fill="#10B981" />
	{/each}
</svg>

<style>
	.packet {
		stroke-dasharray: 4 96;
		animation: travel 3.2s linear infinite;
		filter: drop-shadow(0 0 3px currentColor);
	}
	@keyframes travel {
		from {
			stroke-dashoffset: 100;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.packet {
			animation: none;
			opacity: 0;
		}
	}
</style>
