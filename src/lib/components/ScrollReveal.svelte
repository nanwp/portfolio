<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children: Snippet } = $props();
	let el: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
		);
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div bind:this={el} class="reveal {className}">
	{@render children()}
</div>
