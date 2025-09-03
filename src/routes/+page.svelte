<script>
  const experiences = [
    {
      company: "PT Kreanova Pharmaret (Apotek Roxy)",
      role: "DevOps Engineer",
      date: "Jan 2025 – Jul 2025 (Freelance)",
      description: [
        "Built end-to-end observability stack with Grafana, Prometheus, and Loki, enabling real-time monitoring of performance metrics and centralized log collection.",
        "Optimized CI/CD pipelines using GitLab CI, reducing deployment time by 60% and enabling faster feature releases.",
        "Administered GitLab repositories, enforcing branch protection rules, access control, and repository structure to streamline team collaboration and code quality.",
        "Managed multi-environment servers (development, staging, production), including SSH access setup, load monitoring, and incident troubleshooting, ensuring >99% uptime",
        "Deployed and maintained K3s clusters to improve application scalability and high availability across services.",
        "Automated deployment workflows with Docker, Kubernetes (Helm charts, YAML manifests), cutting manual configuration errors and improving release consistency."
      ]
    },
    {
      company: "PT Busanid Techno Asia",
      role: "Backend Developer",
      date: "Feb 2024 – Jun 2025",
      description: [
        "E-Commerce Platform: Developed backend services in Golang (product catalog, cart, reviews, favorites, payment gateway integration, order queues, and cron schedulers). Designed efficient PostgreSQL queries and materialized views to enhance data retrieval performance.",
        "ERP System Migration: Refactored Laravel services into Golang, redesigned database queries, and introduced pagination to resolve N+1 query issues, cutting API response time from 5 seconds to 100ms, greatly improving system scalability and user experience.",
        "Retail Data Synchronization: Built real-time transaction and stock sync across outlets using Apache Kafka; developed monitoring dashboard with Next.js and deployed per-outlet microservices with Docker.",
        "POS System: Delivered APIs for transactions, stock, and customer management, including PDF generation, email notifications, and rollback-safe data sync services."
      ]
    },
  ];

  const projects = [
    { name: "JPT Bali E-commerce", url: "https://tokojpt.com" },
    { name: "nansql (Golang sqlx lib)", url: "https://github.com/nanwp/nansql" },
    { name: "Real-time Retail Sync", url: "https://medium.com/@nanwp/real-time-retail-data-synchronization-e5e4147d32c2" },
    { name: "Sekolah Penggerak", url: "https://psp-web.pauddikdasmen.kemdikbud.go.id/#/home" }
  ];
</script>

<main class="bg-gray-900 text-gray-100 min-h-screen font-sans p-6">
  <section class="text-center py-10">
    <h1 class="text-4xl font-bold">Nanda Wijaya Putra</h1>
    <p class="text-lg mt-2">Software Engineer</p>
    <p class="text-sm mt-1 text-gray-400">Jakarta, Indonesia</p>
    <p class="text-sm mt-1 text-gray-400">nanwp.dev@gmail.com · github.com/nanwp · medium.com/@nanwp</p>
  </section>

  <section class="max-w-3xl mx-auto py-6">
    <h2 class="text-2xl font-semibold mb-4 border-b border-gray-700 pb-1">About Me</h2>
    <p class="text-gray-300">
      Experienced Backend Developer with a passion for building scalable systems and robust infrastructure.
      Specialized in Golang, Kubernetes, Docker, PostgreSQL, and observability stacks.
    </p>
  </section>

  <section class="max-w-3xl mx-auto py-6">
    <h2 class="text-2xl font-semibold mb-4 border-b border-gray-700 pb-1">Tech Stack</h2>
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
  </section>


  <section class="max-w-3xl mx-auto py-6">
    <h2 class="text-2xl font-semibold mb-4 border-b border-gray-700 pb-1">Work Experience</h2>
    {#each experiences as exp}
      <div class="mb-6">
        <h3 class="text-xl font-semibold">{exp.role} @ {exp.company}</h3>
        <p class="text-sm text-gray-400">{exp.date}</p>
        <ul class="list-disc list-inside text-gray-300 mt-2">
          {#each exp.description as item}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </section>

  <section class="max-w-3xl mx-auto py-6">
    <h2 class="text-2xl font-semibold mb-4 border-b border-gray-700 pb-1">Projects</h2>
    <ul class="list-disc list-inside text-blue-400">
      {#each projects as project}
        <li><a href={project.url} target="_blank" rel="noopener">{project.name}</a></li>
      {/each}
    </ul>
  </section>

  <section class="max-w-3xl mx-auto py-6">
    <h2 class="text-2xl font-semibold mb-4 border-b border-gray-700 pb-1">Writings</h2>
    <ul class="list-disc list-inside text-blue-400">
      <li><a href="https://medium.com/@nanwp/real-time-retail-data-synchronization-e5e4147d32c2" target="_blank">Real-time Retail Data Synchronization</a></li>
      <li><a href="https://nanwp.medium.com/automated-golang-deployment-to-server-with-github-actions-and-docker-98814a438cee" target="_blank">Automated Golang Deployment to Server with GitHub Actions and Docker</a></li>
      <li><a href="https://nanwp.medium.com/building-email-verification-for-user-registration-using-golang-b24c1af2e36b" target="_blank">Building Email Verification for User Registration using Golang</a></li>
    </ul>
  </section>

  <div class="text-center py-4">
    <a href="/resume.pdf" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
      Download My Resume
    </a>
  </div>

  <footer class="text-center text-sm text-gray-500 py-10">
    
    © {new Date().getFullYear()} Nanda Wijaya Putra
  </footer>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
  }
</style>