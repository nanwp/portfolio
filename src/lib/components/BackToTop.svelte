<script lang="ts">
	import { onMount } from 'svelte';

	let visible = $state(false);

	onMount(() => {
		function onScroll() {
			visible = window.scrollY > 400;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

{#if visible}
	<button
		onclick={scrollToTop}
		class="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full
		       bg-gradient-to-r from-indigo-500 to-violet-500 text-white
		       shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50
		       flex items-center justify-center
		       transition-all duration-300 hover:scale-110 cursor-pointer"
		aria-label="Back to top"
	>
		<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
		</svg>
	</button>
{/if}
