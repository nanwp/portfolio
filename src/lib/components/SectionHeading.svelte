<script lang="ts">
	let { title, subtitle = '', gradient = false }: { title: string; subtitle?: string; gradient?: boolean } = $props();
</script>

<div class="mb-10">
	<h2 class="section-title {gradient ? 'gradient-text' : 'text-slate-900 dark:text-white'}">{title}</h2>
	{#if subtitle}
		<p class="section-subtitle">{subtitle}</p>
	{/if}
</div>
