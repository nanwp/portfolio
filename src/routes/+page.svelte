<script lang="ts">
	import experiences from '$lib/data/experiences.json';
	import SceneCanvas from '$lib/components/SceneCanvas.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import StackBento from '$lib/components/StackBento.svelte';
	import TelemetryHUD from '$lib/components/TelemetryHUD.svelte';
	import CaseStudies from '$lib/components/CaseStudies.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import ExperienceTimeline from '$lib/components/ExperienceTimeline.svelte';
	import BlogCard from '$lib/components/BlogCard.svelte';
	import { profile } from '$lib/data/profile';

	let { data } = $props();

	const description = `${profile.summary} ${profile.availability} (${profile.relocation.join(', ')}).`;

	// Structured data so search results and recruiter tools pick up name, role and links.
	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: profile.name,
		jobTitle: profile.title,
		email: `mailto:${profile.email}`,
		url: 'https://nanwp.com',
		address: { '@type': 'PostalAddress', addressLocality: 'Jakarta', addressCountry: 'ID' },
		alumniOf: 'IPB University',
		worksFor: { '@type': 'Organization', name: 'Sekolah.mu' },
		knowsAbout: ['Go', 'gRPC', 'NATS', 'Kafka', 'Kubernetes', 'AWS', 'OpenTelemetry', 'Payments'],
		sameAs: Object.values(profile.links)
	});
</script>

<svelte:head>
	<title>{profile.name} — {profile.title}</title>
	<meta name="description" content={description} />
	<meta property="og:type" content="profile" />
	<meta property="og:title" content="{profile.name} — {profile.title}" />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="https://nanwp.com" />
	<meta property="og:image" content="https://nanwp.com/og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="{profile.name} — {profile.title}" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://nanwp.com/og.png" />
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<SceneCanvas />

<Hero />
<StackBento />
<TelemetryHUD />
<CaseStudies />

<!-- From here on the scene recedes (outro stage) so long-form content stays readable. -->
<section id="experience" data-stage="outro" class="relative scroll-mt-24 py-20 sm:py-24">
	<div class="container mx-auto px-4 sm:px-6">
		<div class="grid gap-12 lg:grid-cols-12">
			<div class="lg:col-span-4">
				<div class="lg:sticky lg:top-28">
					<p class="eyebrow mb-4">04 / Experience</p>
					<h2 class="section-title text-white">Production history.</h2>
					<p class="mt-5 leading-relaxed text-ink-muted">
						{profile.yearsExperience} years across payments, EdTech, retail and e-commerce. Mostly Go,
						always tested, always with dashboards. I own what I ship, on-call included.
					</p>
					<a href={profile.resumeUrl} class="btn-mono mt-6" download>Download full CV (PDF) ↓</a>
					<div class="panel mt-8 p-5 text-sm">
						<p class="mono text-[10.5px] text-ink-faint">education</p>
						<p class="mt-1 text-white">IPB University (Institut Pertanian Bogor)</p>
						<p class="text-ink-muted">
							B.A.Sc. Software Engineering Technology · Aug 2021 – Jul 2025
						</p>
						<p class="mt-3 text-ink-muted">
							Thesis: <em
								>Comprehensive Observability Integration Using Logs, Metrics, and Tracing to Enhance
								Reliability and Scalability of Backend Systems</em
							>
						</p>
						<div class="mt-4 flex flex-wrap gap-1.5">
							<span class="badge-accent"
								>Top 10 of 700+ teams · Hackfest by Google Developer Student Indonesia</span
							>
							<span class="badge-primary">1st · MikroTik Config, Kota Bekasi</span>
						</div>
					</div>
				</div>
			</div>
			<div class="lg:col-span-8">
				{#each experiences as exp, i}
					<ScrollReveal>
						<ExperienceTimeline experience={exp} isLast={i === experiences.length - 1} />
					</ScrollReveal>
				{/each}
			</div>
		</div>
	</div>
</section>

{#if data.recentBlogs.length}
	<section id="writings" class="relative scroll-mt-24 py-20">
		<div class="container mx-auto px-4 sm:px-6">
			<div class="mb-10 flex items-end justify-between gap-4">
				<div>
					<p class="eyebrow mb-4">05 / Writing</p>
					<h2 class="section-title text-white">Notes from production.</h2>
				</div>
				<a href="/blog" class="btn-mono !h-9 text-xs">ls /blog →</a>
			</div>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
				{#each data.recentBlogs as blog}
					<ScrollReveal>
						<BlogCard {blog} />
					</ScrollReveal>
				{/each}
			</div>
		</div>
	</section>
{/if}
