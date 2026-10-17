<script lang="ts">
	import { LAYERS, stack, type StackGroup } from '$lib/data/stack';

	const accent: Record<StackGroup['accent'], { text: string; glow: string; dot: string }> = {
		cyan: { text: 'text-cyan-glow', glow: 'rgba(0,240,255,0.14)', dot: 'bg-cyan-glow' },
		emerald: { text: 'text-emerald-glow', glow: 'rgba(16,185,129,0.14)', dot: 'bg-emerald-glow' },
		steel: { text: 'text-[#c9ccd4]', glow: 'rgba(201,204,212,0.1)', dot: 'bg-[#c9ccd4]' }
	};

	/**
	 * 3D hover: tilt toward the cursor and move a spotlight with it. Writes CSS vars only,
	 * so there's no Svelte re-render per pointer move. Skipped on touch / reduced motion.
	 */
	function tilt(node: HTMLElement) {
		const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!fine || reduced) return;

		const move = (e: PointerEvent) => {
			const r = node.getBoundingClientRect();
			const x = (e.clientX - r.left) / r.width;
			const y = (e.clientY - r.top) / r.height;
			node.style.setProperty('--mx', `${x * 100}%`);
			node.style.setProperty('--my', `${y * 100}%`);
			node.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
			node.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
		};
		const leave = () => {
			node.style.setProperty('--rx', '0deg');
			node.style.setProperty('--ry', '0deg');
		};
		node.addEventListener('pointermove', move);
		node.addEventListener('pointerleave', leave);
		return {
			destroy() {
				node.removeEventListener('pointermove', move);
				node.removeEventListener('pointerleave', leave);
			}
		};
	}
</script>

<section id="architecture" data-stage="architecture" class="relative scroll-mt-24 py-28 sm:py-36">
	<div class="container mx-auto px-4 sm:px-6">
		<div class="grid gap-10 lg:grid-cols-12">
			<div class="lg:col-span-5">
				<p class="eyebrow mb-4">01 / Architecture &amp; Stack</p>
				<h2 class="section-title text-white">Four layers, one system.</h2>
				<p class="mt-5 max-w-md leading-relaxed text-ink-muted">
					Every service I ship sits on the same mental model — the core you see breaking apart
					behind this text. Each layer has a job, a failure mode, and a signal that tells me when
					it's unhappy.
				</p>

				<ol
					class="mono mt-8 space-y-px overflow-hidden rounded-xl border border-white/[0.06] text-[12px]"
				>
					{#each [...LAYERS].reverse() as layer, i}
						<li class="flex items-center justify-between bg-white/[0.02] px-4 py-2.5">
							<span class="text-ink-faint">L{LAYERS.length - i}</span>
							<span class="text-ink">{layer}</span>
						</li>
					{/each}
				</ol>
			</div>
		</div>

		<!-- spacer so the exploded core has room on large screens -->
		<div class="hidden h-[28vh] lg:block"></div>

		<div
			class="grid auto-rows-[minmax(10rem,auto)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6"
		>
			{#each stack as group (group.id)}
				{@const a = accent[group.accent]}
				<article
					use:tilt
					class="bento panel edge-light group relative overflow-hidden p-6 {group.span}"
					style="--glow: {a.glow}"
				>
					<div class="spotlight pointer-events-none absolute inset-0"></div>

					<header class="relative flex items-start justify-between gap-4">
						<div>
							<p class="mono text-[10.5px] tracking-wider text-ink-faint">{group.layer}</p>
							<h3 class="mt-1.5 text-lg font-semibold tracking-tight text-white">{group.title}</h3>
						</div>
						<span
							class="mt-1 h-1.5 w-1.5 rounded-full {a.dot} shadow-[0_0_10px_currentColor] {a.text}"
						></span>
					</header>
					<p class="relative mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">{group.blurb}</p>

					<ul class="relative mt-6 grid gap-1.5 {group.id === 'backend' ? 'sm:grid-cols-2' : ''}">
						{#each group.items as item}
							<li
								class="flex items-center justify-between gap-3 rounded-lg border border-white/[0.05] bg-black/20 px-3 py-2 transition-colors group-hover:border-white/[0.08]"
							>
								<span class="text-sm text-ink">{item.name}</span>
								<span class="mono truncate text-[10.5px] text-ink-faint">{item.note}</span>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.bento {
		transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
		transition:
			transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1),
			border-color 0.3s;
		will-change: transform;
	}
	.bento:hover {
		border-color: rgba(255, 255, 255, 0.14);
		transition:
			transform 0.12s linear,
			border-color 0.3s;
	}
	.spotlight {
		opacity: 0;
		transition: opacity 0.3s;
		background: radial-gradient(
			420px circle at var(--mx, 50%) var(--my, 50%),
			var(--glow),
			transparent 60%
		);
	}
	.bento:hover .spotlight {
		opacity: 1;
	}
</style>
