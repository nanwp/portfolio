<script lang="ts">
	import { onMount } from 'svelte';
	import { sceneRef } from '$lib/stores/ui.svelte';
	import TopologyFallback from './TopologyFallback.svelte';
	import { LAYERS } from '$lib/data/stack';

	/** Sections carrying `data-stage="<name>"`, in scroll order. */
	const ORDER = ['hero', 'architecture', 'telemetry', 'work', 'outro'] as const;

	let canvas = $state<HTMLCanvasElement>();
	let mode = $state<'pending' | 'webgl' | 'fallback'>('pending');
	let ready = $state(false);
	const labelEls: HTMLElement[] = [];

	function supportsWebGL() {
		try {
			const c = document.createElement('canvas');
			return !!(c.getContext('webgl2') || c.getContext('webgl'));
		} catch {
			return false;
		}
	}

	onMount(() => {
		const narrow = matchMedia('(max-width: 767px)').matches;
		const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
			?.saveData;
		if (narrow || saveData || !supportsWebGL()) {
			mode = 'fallback';
			return;
		}
		mode = 'webgl';

		let disposed = false;
		let cleanup = () => {};

		(async () => {
			// Three + GSAP are only fetched on capable devices, after first paint.
			const [{ NetworkScene, STAGES }, { gsap }, { ScrollTrigger }] = await Promise.all([
				import('$lib/three/NetworkScene'),
				import('gsap'),
				import('gsap/ScrollTrigger')
			]);
			if (disposed || !canvas) return;
			gsap.registerPlugin(ScrollTrigger);

			const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
			const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
			const scene = new NetworkScene(canvas, { reducedMotion, quality: lowPower ? 'low' : 'high' });
			scene.setLabels(labelEls, [...document.querySelectorAll('[data-scene-occluder]')]);
			sceneRef.current = scene;

			const ctx = gsap.context(() => {
				for (let i = 1; i < ORDER.length; i++) {
					const el = document.querySelector(`[data-stage="${ORDER[i]}"]`);
					if (!el) continue;
					gsap.fromTo(
						scene.state,
						{ ...STAGES[ORDER[i - 1]] },
						{
							...STAGES[ORDER[i]],
							ease: 'power1.inOut',
							immediateRender: false,
							scrollTrigger: {
								trigger: el,
								start: 'top 85%',
								end: 'top 20%',
								scrub: reducedMotion ? true : 1.2
							}
						}
					);
				}
			});

			scene.start();
			ready = true;

			cleanup = () => {
				ctx.revert();
				scene.dispose();
				sceneRef.current = null;
			};
		})();

		return () => {
			disposed = true;
			cleanup();
		};
	});
</script>

<div class="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
	<div class="dot-grid fade-mask-b absolute inset-0 opacity-60"></div>

	{#if mode === 'fallback'}
		<TopologyFallback />
	{:else}
		<canvas
			bind:this={canvas}
			class="absolute inset-0 h-full w-full transition-[filter] duration-1000 {ready
				? ''
				: 'blur-sm'}"
			style="opacity: 0"
		></canvas>
	{/if}

	<!-- vignette keeps copy legible over the scene -->
	<div
		class="absolute inset-0"
		style="background: radial-gradient(ellipse at 70% 40%, transparent 0%, rgba(7,7,9,0.35) 55%, rgba(7,7,9,0.9) 100%);"
	></div>

	{#if mode === 'webgl'}
		<!-- layer callouts; NetworkScene moves them beside their slabs every frame -->
		{#each LAYERS as layer, i}
			<div bind:this={labelEls[i]} class="layer-label mono" style="opacity: 0">
				<span class="layer-tick"></span>
				<span class="text-ink-faint">L{i + 1}</span>
				<span>{layer}</span>
			</div>
		{/each}
	{/if}
</div>

<style>
	.layer-label {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		white-space: nowrap;
		font-size: 11px;
		letter-spacing: 0.04em;
		color: var(--ink-muted);
		will-change: transform, opacity;
		transition:
			color 0.25s,
			opacity 0.2s;
	}
	.layer-tick {
		width: 1.75rem;
		height: 1px;
		background: rgba(255, 255, 255, 0.25);
		transition:
			background 0.25s,
			width 0.25s;
	}
	.layer-label:global([data-active='true']) {
		color: var(--cyan);
	}
	.layer-label:global([data-active='true']) .layer-tick {
		width: 2.75rem;
		background: var(--cyan);
		box-shadow: 0 0 8px var(--cyan);
	}
</style>
