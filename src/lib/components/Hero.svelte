<script lang="ts">
	import { profile } from '$lib/data/profile';

	const facts = [
		{ k: 'experience', v: `${profile.yearsExperience} yrs · Go backend` },
		{ k: 'currently', v: `${profile.current.role} @ ${profile.current.company}` },
		{ k: 'based in', v: `Jakarta · ${profile.timezone}` },
		{ k: 'open to', v: 'Remote · Relocation' }
	];
</script>

<section id="hero" data-stage="hero" class="relative flex min-h-[100svh] items-center">
	<div class="container mx-auto w-full px-4 pb-20 pt-28 sm:px-6">
		<div class="max-w-2xl">
			<a
				href="#contact"
				class="mono mb-6 inline-flex max-w-full items-center gap-2.5 rounded-2xl sm:rounded-full border border-emerald-glow/25 bg-emerald-glow/[0.07] py-1.5 pl-3 pr-3.5 text-[11px] text-emerald-300 no-underline transition-colors hover:border-emerald-glow/50 hover:text-emerald-200"
			>
				<span class="status-dot shrink-0"></span>
				<span>
					Open to remote &amp; relocation w/ visa sponsorship
					<span class="whitespace-nowrap text-emerald-300/60"
						>→ {profile.relocation.join(' · ')}</span
					>
				</span>
			</a>

			<p
				class="mono mb-7 flex flex-wrap items-center gap-x-2 text-[11px] tracking-[0.16em] text-ink-muted"
			>
				<span class="text-cyan-glow/70">[</span>
				BACKEND <span class="text-ink-faint">•</span> CLOUD INFRASTRUCTURE
				<span class="text-ink-faint">•</span>
				DISTRIBUTED SYSTEMS
				<span class="text-cyan-glow/70">]</span>
			</p>

			<h1
				class="metal-text text-[clamp(2.5rem,6.2vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em]"
			>
				Architecting resilient systems &amp; scalable cloud <span class="hero-accent"
					>infrastructure.</span
				>
			</h1>

			<p class="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-ink-muted">
				I'm <span class="text-ink">{profile.name}</span>, a backend engineer building
				<span class="text-ink">Go</span> microservices for
				<span class="text-ink">payments, billing &amp; high-traffic platforms</span>: gRPC, NATS and
				Kafka on AWS and Kubernetes, with observability built in from day one.
			</p>

			<div class="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
				<a href="#work" class="btn-glow justify-center">
					View my work
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M12 5v14m0 0 6-6m-6 6-6-6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</a>
				<a href={profile.resumeUrl} class="btn-mono justify-center" download>
					<span class="text-cyan-glow">$</span> cat resume.pdf
					<svg
						class="h-3.5 w-3.5 text-ink-muted"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19h14"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
			</div>
		</div>

		<!-- at-a-glance facts for recruiters -->
		<dl
			class="mono mt-12 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] text-[11px] sm:grid-cols-4"
		>
			{#each facts as f}
				<div class="bg-obsidian/80 px-4 py-3 backdrop-blur">
					<dt class="text-ink-faint">{f.k}</dt>
					<dd class="mt-1 text-ink">{f.v}</dd>
				</div>
			{/each}
		</dl>
	</div>

	<a
		href="#architecture"
		class="mono absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.2em] text-ink-faint no-underline hover:text-ink-muted sm:flex"
	>
		SCROLL
		<span class="h-8 w-px bg-gradient-to-b from-white/30 to-transparent"></span>
	</a>
</section>
