<script lang="ts">
	import experiences from '$lib/data/experiences.json';
	import projects from '$lib/data/projects.json';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import ExperienceTimeline from '$lib/components/ExperienceTimeline.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import BlogCard from '$lib/components/BlogCard.svelte';

	const techStack = [
		{
			category: 'Languages',
			color: 'from-blue-500/20 to-cyan-500/20',
			borderColor: 'border-blue-500/20',
			items: ['Go', 'TypeScript', 'JavaScript', 'Python', 'Java', 'SQL']
		},
		{
			category: 'Frameworks',
			color: 'from-violet-500/20 to-purple-500/20',
			borderColor: 'border-violet-500/20',
			items: ['Echo', 'Gin', 'Bun', 'Elysia.js', 'Vue.js', 'Next.js']
		},
		{
			category: 'Data & Messaging',
			color: 'from-emerald-500/20 to-teal-500/20',
			borderColor: 'border-emerald-500/20',
			items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'NATS', 'Kafka', 'PubSub']
		},
		{
			category: 'Cloud & DevOps',
			color: 'from-orange-500/20 to-amber-500/20',
			borderColor: 'border-orange-500/20',
			items: ['Kubernetes', 'Docker', 'AWS', 'Nginx', 'Prometheus', 'Grafana', 'Loki', 'OpenTelemetry', 'gRPC']
		}
	];

	const stats = [
		{ value: '95%', label: 'Faster Transfers', icon: '⚡' },
		{ value: '50x', label: 'API Speedup', icon: '🚀' },
		{ value: '60%', label: 'Deploy Time Cut', icon: '🔧' },
		{ value: '10+', label: 'Microservices', icon: '🏗️' },
	];

	let { data } = $props();
	const recentBlogs = data.recentBlogs;
</script>

<svelte:head>
	<title>Nanda Wijaya Putra — Software Engineer</title>
	<meta name="description" content="Strategic Software Engineer specializing in observability, cloud-native systems, and payment architectures." />
</svelte:head>

<!-- ═══ HERO ═══ -->
<section id="hero" class="relative overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-b from-indigo-500/15 via-transparent to-transparent dark:from-indigo-500/[0.07] pointer-events-none"></div>
	<div class="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/[0.04] rounded-full blur-3xl pointer-events-none"></div>

	<div class="container mx-auto px-6 pt-24 pb-20 text-center relative">
		<div class="mb-6">
			<span class="badge-primary text-xs px-3 py-1">Available for opportunities</span>
		</div>

		<h1 class="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
			<span class="text-slate-900 dark:text-white">Hi, I'm </span>
			<span class="gradient-text">Nanda</span>
		</h1>

		<p class="text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-4">
			Strategic Software Engineer specializing in
			<span class="text-indigo-600 dark:text-indigo-400">observability</span>,
			<span class="text-violet-600 dark:text-violet-400">cloud-native systems</span>, and
			<span class="text-cyan-700 dark:text-cyan-400">payment architectures</span>.
		</p>

		<p class="text-sm text-slate-500 dark:text-gray-500 mb-8">Jakarta, Indonesia</p>

		<div class="flex items-center justify-center gap-4 mb-10">
			<a href="#projects" class="btn-primary">View My Work</a>
			<a href="#contact" class="btn-outline">Get in Touch</a>
		</div>

		<div class="flex items-center justify-center gap-5">
			<a href="https://github.com/nanwp" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-white transition-colors no-underline" aria-label="GitHub">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
			</a>
			<a href="https://linkedin.com/in/nanwp" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-white transition-colors no-underline" aria-label="LinkedIn">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
			</a>
			<a href="https://medium.com/@nanwp" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-white transition-colors no-underline" aria-label="Medium">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>
			</a>
			<a href="mailto:nanwp.dev@gmail.com" class="text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-white transition-colors no-underline" aria-label="Email">
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
				</svg>
			</a>
		</div>
	</div>
</section>

<!-- ═══ ABOUT ═══ -->
<section id="about" class="py-16">
	<div class="container mx-auto px-6">
		<ScrollReveal>
			<div class="glass-card p-8 md:p-10">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div class="md:col-span-2">
						<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">About Me</h2>
						<p class="text-slate-600 dark:text-gray-400 leading-relaxed mb-4">
							I'm a software engineer with a deep focus on building resilient, observable backend systems. 
							With hands-on experience across payment platforms, EdTech systems, and e-commerce infrastructure, 
							I specialize in designing microservice architectures that scale.
						</p>
						<p class="text-slate-600 dark:text-gray-400 leading-relaxed">
							My expertise spans from building event-driven pipelines with Kafka and NATS, to implementing 
							comprehensive observability stacks with Grafana, Prometheus, and OpenTelemetry. I'm passionate 
							about DevSecOps practices and cloud-native development on AWS.
						</p>
					</div>
					<div class="flex flex-col gap-3">
						<div class="rounded-xl bg-slate-50 border border-slate-200/90 dark:bg-white/[0.03] dark:border-white/[0.06] p-4">
							<p class="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-1">Location</p>
							<p class="text-sm text-slate-800 dark:text-gray-300">Jakarta, Indonesia</p>
						</div>
						<div class="rounded-xl bg-slate-50 border border-slate-200/90 dark:bg-white/[0.03] dark:border-white/[0.06] p-4">
							<p class="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-1">Education</p>
							<p class="text-sm text-slate-800 dark:text-gray-300">Institut Pertanian Bogor</p>
							<p class="text-xs text-slate-500 dark:text-gray-500">B.Sc. Software Engineering Technology</p>
						</div>
						<div class="rounded-xl bg-slate-50 border border-slate-200/90 dark:bg-white/[0.03] dark:border-white/[0.06] p-4">
							<p class="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-1">Focus</p>
							<p class="text-sm text-slate-800 dark:text-gray-300">Backend & Cloud Infrastructure</p>
						</div>
					</div>
				</div>
			</div>
		</ScrollReveal>
	</div>
</section>

<!-- ═══ STATS ═══ -->
<!-- <section class="py-8">
	<div class="container mx-auto px-6">
		<ScrollReveal>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 reveal-stagger">
				{#each stats as stat}
					<div class="reveal glass-card p-6 text-center group hover:border-indigo-300 dark:hover:border-indigo-500/20 transition-all duration-300">
						<span class="text-2xl mb-2 block">{stat.icon}</span>
						<p class="text-3xl font-black gradient-text mb-1">{stat.value}</p>
						<p class="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider">{stat.label}</p>
					</div>
				{/each}
			</div>
		</ScrollReveal>
	</div>
</section> -->

<!-- ═══ TECH STACK ═══ -->
<section id="tech" class="py-16">
	<div class="container mx-auto px-6">
		<ScrollReveal>
			<SectionHeading title="Tech Stack" subtitle="Technologies and tools I work with daily" gradient />
		</ScrollReveal>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each techStack as group}
				<ScrollReveal>
					<div class="glass-card p-6 h-full">
						<h3 class="text-sm font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider mb-4">{group.category}</h3>
						<div class="flex flex-wrap gap-2">
							{#each group.items as item}
								<span class="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium bg-gradient-to-r {group.color} border {group.borderColor} text-slate-800 dark:text-gray-200 transition-all duration-200 hover:scale-105">
									{item}
								</span>
							{/each}
						</div>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ EXPERIENCE ═══ -->
<section id="experience" class="py-16">
	<div class="container mx-auto px-6">
		<ScrollReveal>
			<SectionHeading title="Experience" subtitle="My professional journey" gradient />
		</ScrollReveal>

		<div class="max-w-3xl mx-auto">
			{#each experiences as exp, i}
				<ScrollReveal>
					<ExperienceTimeline experience={exp} isLast={i === experiences.length - 1} />
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ EDUCATION ═══ -->
<section id="education" class="py-16">
	<div class="container mx-auto px-6">
		<ScrollReveal>
			<SectionHeading title="Education" subtitle="Academic background and achievements" gradient />
		</ScrollReveal>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
			<ScrollReveal>
				<div class="glass-card p-6 h-full">
					<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-300/70 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-1">Institut Pertanian Bogor</h3>
					<p class="text-sm text-slate-500 dark:text-gray-500 mb-3">Bachelor of Software Engineering Technology &middot; 2021–2025</p>
					<p class="text-sm text-slate-600 dark:text-gray-400 mb-3 leading-relaxed">
						Thesis: Comprehensive Observability Integration Using Logs, Metrics, and Tracing to Enhance Reliability and Scalability of Backend Systems
					</p>
					<span class="badge-accent text-[10px]">Top 10 Finalist — Google Hackfest (700+ teams)</span>
				</div>
			</ScrollReveal>

			<ScrollReveal>
				<div class="glass-card p-6 h-full">
					<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-300/70 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-1">SMKN 2 Kota Bekasi</h3>
					<p class="text-sm text-slate-500 dark:text-gray-500 mb-3">Vocational High School &middot; 2019–2021</p>
					<p class="text-sm text-slate-600 dark:text-gray-400 mb-3 leading-relaxed">
						Focused on computer networking and system administration. Built a strong foundation in infrastructure and networking concepts.
					</p>
					<span class="badge-accent text-[10px]">1st Place — MikroTik Configuration (Kota Bekasi)</span>
				</div>
			</ScrollReveal>
		</div>
	</div>
</section>

<!-- ═══ PROJECTS ═══ -->
<section id="projects" class="py-16">
	<div class="container mx-auto px-6">
		<ScrollReveal>
			<SectionHeading title="Projects" subtitle="Things I've built and shipped" gradient />
		</ScrollReveal>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
			{#each projects as project}
				<ScrollReveal>
					<ProjectCard {project} />
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ BLOG PREVIEW ═══ -->
<section id="writings" class="py-16">
	<div class="container mx-auto px-6">
		<ScrollReveal>
			<div class="flex items-end justify-between mb-10">
				<div>
					<h2 class="section-title gradient-text">Latest Writings</h2>
					<p class="section-subtitle mb-0">Thoughts on engineering and architecture</p>
				</div>
				<a href="/blog" class="btn-ghost text-sm hidden sm:inline-flex">
					View all
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
					</svg>
				</a>
			</div>
		</ScrollReveal>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each recentBlogs as blog}
				<ScrollReveal>
					<BlogCard {blog} />
				</ScrollReveal>
			{/each}
		</div>

		<div class="mt-6 text-center sm:hidden">
			<a href="/blog" class="btn-ghost text-sm">
				View all posts
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
				</svg>
			</a>
		</div>
	</div>
</section>

<!-- ═══ CONTACT CTA ═══ -->
<section id="contact" class="py-20">
	<div class="container mx-auto px-6">
		<ScrollReveal>
			<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-cyan-500/10 border border-slate-200/90 dark:from-indigo-500/10 dark:border-white/[0.08] p-10 md:p-16 text-center">
				<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/[0.05] rounded-full blur-3xl pointer-events-none"></div>
				
				<h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 relative">
					Let's work together
				</h2>
				<p class="text-slate-600 dark:text-gray-400 max-w-lg mx-auto mb-8 relative">
					I'm always open to discussing new projects, creative ideas, or opportunities to be part of your engineering team.
				</p>
				<div class="flex items-center justify-center gap-4 relative">
					<a href="mailto:nanwp.dev@gmail.com" class="btn-primary">
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
						</svg>
						Send Email
					</a>
					<a href="https://linkedin.com/in/nanwp" target="_blank" rel="noopener" class="btn-outline">
						LinkedIn
					</a>
				</div>
			</div>
		</ScrollReveal>
	</div>
</section>
