<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import BackToTop from '$lib/components/BackToTop.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a]">
	<Navbar />

	<main class="flex-1">
		{@render children()}
	</main>

	<Footer />
	<BackToTop />
</div>
