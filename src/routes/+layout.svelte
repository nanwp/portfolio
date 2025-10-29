<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-950 text-gray-100">
  <header class="sticky top-0 z-40 bg-gray-950/80 backdrop-blur border-b border-white/10">
    <nav class="container mx-auto px-6 py-4 flex items-center justify-between">
      <a href="/" class="text-lg font-semibold tracking-tight">Nanda Wijaya Putra</a>
      <div class="hidden sm:flex gap-4 text-sm text-gray-300">
        <a href="#about">About</a>
        <a href="#education">Education</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </div>
      <a href="/resume.pdf" class="btn-outline">Download Resume</a>
    </nav>
  </header>

  <main class="container mx-auto px-6">
    {@render children()}
  </main>

  <footer class="container mx-auto px-6 py-10 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} Nanda Wijaya Putra
  </footer>
</div>
