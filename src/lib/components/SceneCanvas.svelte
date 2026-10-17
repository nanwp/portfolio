<script lang="ts">
	import { onMount } from 'svelte';
	import { sceneRef } from '$lib/stores/ui.svelte';
	import TopologyFallback from './TopologyFallback.svelte';

	/** Sections carrying `data-stage="<name>"`, in scroll order. */
	const ORDER = ['hero', 'architecture', 'telemetry', 'work', 'outro'] as const;

	let canvas = $state<HTMLCanvasElement>();
	let mode = $state<'pending' | 'webgl' | 'fallback'>('pending');
	let ready = $state(false);

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
</div>
