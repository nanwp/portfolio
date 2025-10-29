<script>
	const experiences = [
		{
			company: 'PT Semesta Integrasi Digital (Sekolahmu HQ)',
			role: 'Software Engineer',
			date: 'Sep 2025 – Current',
			location: 'Jakarta, Indonesia (Remote)',
			description: [
				'Developed an internal web application to improve operational and financial efficiency within the organization.',
				'Automated several manual workflows including student transfers, voucher management, and financial reporting.',
				'Built RESTful APIs using Golang to ensure scalability, performance, and maintainability.',
				'Designed a Vue.js-based frontend for intuitive and responsive user interaction.',
				'Integrated the system with the core school management platform to synchronize operational and financial data.',
				'Reduced manual work for the Operations and Finance teams, resulting in faster and more accurate processes.'
			]
		},
		{
			company: 'PT Kreanova Pharmaret (Apotek Roxy)',
			role: 'DevOps Engineer',
			date: 'Jan 2025 – Current (Freelance)',
			location: 'Jakarta, Indonesia (Remote)',
			description: [
				'Built an end-to-end observability stack using Grafana, Prometheus, and Loki, enabling real-time monitoring of application performance and centralized log management.',
				'Optimized CI/CD pipelines with GitLab CI, reducing deployment time by 60% and accelerating feature delivery across environments.',
				'Administered GitLab repositories, implementing branch protection rules, access control, and repository standardization to improve team collaboration and code quality.',
				'Managed multi-environment servers (development, staging, production), including SSH access setup, load monitoring, and incident resolution — maintaining >99% service uptime.',
				'Deployed and maintained lightweight Kubernetes clusters (K3s) to enhance scalability, reliability, and high availability across distributed services.',
				'Automated deployment workflows using Docker and Kubernetes (Helm charts, YAML manifests), minimizing manual configuration errors and ensuring consistent releases.',
				'Designed and implemented **AWS cloud infrastructure for production**, including ECS, ALB, S3, CloudWatch, and Secrets Manager — ensuring secure, scalable, and cost-efficient deployments.'
			]
		},
		{
			company: 'Hunt ADR (Mediation Training & CPD | Mediation & Arbitration Services)',
			role: 'Fullstack Developer',
			date: 'Jan 2025 – Jul 2025 (Freelance)',
			location: 'London, UK (Remote)',
			description: [
				'Maintained and enhanced an existing web platform, ensuring stability and performance.',
				'Implemented JWT-based authentication to secure user access.',
				'Developed a weekly automated reporting system for platform owners to track new registrations.',
				'Built a real-time chat feature between customers, arbitrators, and platform staff to improve communication.',
				'Delivered bug fixes, feature improvements, and ongoing system maintenance to support business operations.'
			]
		},
		{
			company: 'PT Busanid Techno Asia',
			role: 'Backend Developer',
			date: 'Feb 2024 – Jun 2025',
			location: 'Jakarta, Indonesia',
			description: [
				'E-Commerce Platform: Developed backend services in Golang (product catalog, cart, reviews, favorites, payment gateway integration, order queues, and cron schedulers). Designed efficient PostgreSQL queries and materialized views to enhance data retrieval performance.',
				'ERP System Migration: Refactored Laravel services into Golang, redesigned database queries, and introduced pagination to resolve N+1 query issues, cutting API response time from 5 seconds to 100ms, greatly improving system scalability and user experience.',
				'Retail Data Synchronization: Built real-time transaction and stock sync across outlets using Apache Kafka; developed monitoring dashboard with Next.js and deployed per-outlet microservices with Docker.',
				'POS System: Delivered APIs for transactions, stock, and customer management, including PDF generation, email notifications, and rollback-safe data sync services.'
			]
		}
	];

	const projects = [
		{ name: 'nansql (Golang sqlx lib)', url: 'https://github.com/nanwp/nansql' },
		{
			name: 'Real-time Retail Sync',
			url: 'https://medium.com/@nanwp/real-time-retail-data-synchronization-e5e4147d32c2'
		},
	];
</script>

<section id="hero" class="text-center py-14">
  <h1 class="text-4xl md:text-5xl font-bold tracking-tight">Nanda Wijaya Putra</h1>
  <p class="text-lg mt-2 text-gray-300">Software Engineer • Backend & DevOps</p>
  <p class="text-sm mt-1 text-gray-400">Jakarta, Indonesia</p>
  <p class="text-sm mt-2 text-gray-400">
    <a href="mailto:nanwp.dev@gmail.com">nanwp.dev@gmail.com</a> ·
    <a href="https://github.com/nanwp" target="_blank" rel="noopener">github.com/nanwp</a> ·
    <a href="https://medium.com/@nanwp" target="_blank" rel="noopener">medium.com/@nanwp</a>
  </p>
  <div class="mt-6 flex items-center justify-center gap-3">
    <a href="#projects" class="btn-primary">View Projects</a>
    <a href="/resume.pdf" class="btn-outline">Download Resume</a>
  </div>
</section>

<section id="about" class="py-8">
  <div class="card p-6">
    <h2 class="text-2xl font-semibold mb-3">About Me</h2>
    <p class="text-gray-300">
      Experienced Backend Developer with a passion for building scalable systems and robust
      infrastructure. Specialized in Golang, Kubernetes, Docker, PostgreSQL, and observability
      stacks.
    </p>
  </div>
</section>

<section id="tech" class="py-8">
  <div class="card p-6">
    <h2 class="text-2xl font-semibold mb-4">Tech Stack</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-300">
      <span>Golang</span>
      <span>PostgreSQL</span>
      <span>Docker</span>
      <span>Kubernetes (K3s)</span>
      <span>GitLab CI/CD</span>
      <span>Prometheus</span>
      <span>Grafana</span>
      <span>Loki</span>
      <span>Redis</span>
      <span>Kafka</span>
    </div>
  </div>
</section>

<section id="experience" class="py-8">
  <div class="card p-6">
    <h2 class="text-2xl font-semibold mb-4">Work Experience</h2>
    {#each experiences as exp}
      <div class="mb-6">
        <h3 class="text-xl font-semibold">{exp.role} @ {exp.company}</h3>
        <p class="text-gray-400">{exp.location}</p>
        <p class="text-sm text-gray-400">{exp.date}</p>
        <ul class="list-disc list-inside text-gray-300 mt-2">
          {#each exp.description as item}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</section>

<section id="highlights" class="py-8">
  <div class="card p-6">
    <h2 class="section-title">Highlights</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="badge">60% faster deployments</div>
      <div class="badge">99%+ service uptime</div>
      <div class="badge">Observability</div>
      <div class="badge">Scalability</div>
      <div class="badge">Reliability</div>
      <div class="badge">K3s + Kafka experience</div>
    </div>
  </div>
  </section>

<section id="projects" class="py-8">
  <div class="card p-6">
    <h2 class="section-title">Projects</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each projects as project}
        <article class="rounded-lg border border-white/10 bg-white/5 p-4">
          <a href={project.url} target="_blank" rel="noopener" class="text-blue-400 font-semibold">
            {project.name}
          </a>
          <div class="mt-2 flex gap-2">
            <span class="badge">Golang</span>
            <span class="badge">SQL</span>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<section id="writings" class="py-8">
  <div class="card p-6">
    <h2 class="text-2xl font-semibold mb-4">Writings</h2>
    <ul class="list-disc list-inside">
      <li>
        <a
          href="https://medium.com/@nanwp/real-time-retail-data-synchronization-e5e4147d32c2"
          target="_blank">Real-time Retail Data Synchronization</a>
      </li>
      <li>
        <a
          href="https://nanwp.medium.com/automated-golang-deployment-to-server-with-github-actions-and-docker-98814a438cee"
          target="_blank">Automated Golang Deployment to Server with GitHub Actions and Docker</a>
      </li>
      <li>
        <a
          href="https://nanwp.medium.com/building-email-verification-for-user-registration-using-golang-b24c1af2e36b"
          target="_blank">Building Email Verification for User Registration using Golang</a>
      </li>
    </ul>
  </div>
</section>

<div id="contact" class="text-center py-10">
  <div class="flex justify-center gap-3">
    <a href="mailto:nanwp.dev@gmail.com" class="btn-primary">Contact Me</a>
    <a href="/resume.pdf" class="btn-outline">Download Resume</a>
  </div>
</div>
