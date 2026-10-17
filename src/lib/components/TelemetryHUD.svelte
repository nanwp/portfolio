<script lang="ts">
	import { onMount } from 'svelte';
	import { impact } from '$lib/data/caseStudies';

	// The HUD stream is a simulation for visual flavour; the impact numbers beside it are real.
	const POINTS = 40;
	let latency = $state(Array.from({ length: POINTS }, (_, i) => 40 + Math.sin(i / 3) * 8));
	let rps = $state(2140);
	let errRate = $state(0.02);
	let logs = $state<{ t: string; level: 'INFO' | 'WARN'; msg: string }[]>([]);

	const services = ['payment-svc', 'billing-svc', 'voucher-svc', 'ledger-worker', 'notif-worker'];
	const messages = [
		'grpc  Charge  OK',
		'nats  billing.invoice.created  ack',
		'pg    tx committed',
		'redis cache hit  voucher:*',
		'http  POST /v1/checkout 201',
		'nats  consumer lag 0'
	];

	const spark = $derived.by(() => {
		const max = 80;
		return latency
			.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (POINTS - 1)) * 100} ${40 - (v / max) * 40}`)
			.join(' ');
	});
	const p99 = $derived(Math.max(...latency.slice(-10)));

	const spans = [
		{ name: 'POST /v1/checkout', svc: 'gateway', start: 0, dur: 100 },
		{ name: 'Billing.CreateInvoice', svc: 'billing-svc', start: 6, dur: 38 },
		{ name: 'SELECT invoices', svc: 'postgres', start: 12, dur: 14 },
		{ name: 'Payment.Charge', svc: 'payment-svc', start: 46, dur: 44 },
		{ name: 'publish payment.settled', svc: 'nats', start: 84, dur: 8 }
	];

	function stamp() {
		return new Date().toISOString().slice(11, 23);
	}

	onMount(() => {
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		logs = Array.from({ length: 6 }, (_, i) => ({
			t: stamp(),
			level: 'INFO',
			msg: `${services[i % services.length].padEnd(14)} ${messages[i % messages.length]}`
		}));
		if (reduced) return;

		const id = setInterval(() => {
			const last = latency[latency.length - 1];
			const spike = Math.random() > 0.93 ? 22 : 0;
			latency = [
				...latency.slice(1),
				Math.max(18, Math.min(78, last + (Math.random() - 0.5) * 10 + spike))
			];
			rps = Math.round(Math.max(1500, Math.min(2900, rps + (Math.random() - 0.5) * 220)));
			errRate = Math.max(0, Math.min(0.2, errRate + (Math.random() - 0.5) * 0.02));
			const warn = spike > 0;
			logs = [
				...logs.slice(-6),
				{
					t: stamp(),
					level: warn ? 'WARN' : 'INFO',
					msg: warn
						? `${'ledger-worker'.padEnd(14)} slow consumer  p99>${Math.round(p99)}ms`
						: `${services[Math.floor(Math.random() * services.length)].padEnd(14)} ${messages[Math.floor(Math.random() * messages.length)]}`
				}
			];
		}, 900);
		return () => clearInterval(id);
	});
</script>

<section id="telemetry" data-stage="telemetry" class="relative scroll-mt-24 py-28 sm:py-36">
	<div class="container mx-auto px-4 sm:px-6">
		<div class="max-w-xl">
			<p class="eyebrow mb-4">02 / Observability &amp; Impact</p>
			<h2 class="section-title text-white">If it isn't observable, it isn't done.</h2>
			<p class="mt-5 leading-relaxed text-ink-muted">
				My thesis was on unifying logs, metrics and traces; my day job is making sure the on-call
				engineer sees the problem before the customer does. Results from production work:
			</p>
		</div>

		<dl class="mt-10 grid grid-cols-2 gap-3 lg:max-w-xl">
			{#each impact as m}
				<div class="panel p-5">
					<dd class="mono text-2xl font-semibold tracking-tight text-white sm:text-[1.7rem]">
						{m.value}
					</dd>
					<dt class="mt-1 text-sm text-ink">{m.label}</dt>
					<p class="mono mt-2 text-[10.5px] text-ink-faint">{m.source}</p>
				</div>
			{/each}
		</dl>

		<!-- HUD -->
		<div
			class="panel edge-light mono mt-6 overflow-hidden text-[11px] lg:max-w-xl"
			aria-label="Simulated telemetry"
		>
			<div class="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
				<span class="flex items-center gap-2 text-ink-muted"
					><span class="status-dot"></span> payments / prod</span
				>
				<span class="text-ink-faint">simulated feed</span>
			</div>

			<div class="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06]">
				<div class="px-4 py-3">
					<p class="text-ink-faint">req/s</p>
					<p class="mt-1 text-base tabular-nums text-white">{rps.toLocaleString('en-US')}</p>
				</div>
				<div class="px-4 py-3">
					<p class="text-ink-faint">p99</p>
					<p class="mt-1 text-base tabular-nums {p99 > 65 ? 'text-amber-300' : 'text-cyan-glow'}">
						{p99.toFixed(0)}ms
					</p>
				</div>
				<div class="px-4 py-3">
					<p class="text-ink-faint">errors</p>
					<p class="mt-1 text-base tabular-nums text-emerald-glow">{errRate.toFixed(2)}%</p>
				</div>
			</div>

			<svg
				viewBox="0 0 100 40"
				preserveAspectRatio="none"
				class="block h-16 w-full border-b border-white/[0.06]"
			>
				<defs>
					<linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0" stop-color="#00F0FF" stop-opacity="0.25" />
						<stop offset="1" stop-color="#00F0FF" stop-opacity="0" />
					</linearGradient>
				</defs>
				<path d="{spark} L100 40 L0 40 Z" fill="url(#spark-fill)" />
				<path
					d={spark}
					fill="none"
					stroke="#00F0FF"
					stroke-width="0.6"
					vector-effect="non-scaling-stroke"
				/>
			</svg>

			<div class="border-b border-white/[0.06] px-4 py-3">
				<p class="mb-2 text-ink-faint">trace 4bf92f35… · 212ms</p>
				<ul class="space-y-1">
					{#each spans as s}
						<li class="grid grid-cols-[9rem_1fr] items-center gap-3">
							<span class="truncate text-ink-muted">{s.name}</span>
							<span class="relative h-2.5">
								<span
									class="absolute top-0 h-full rounded-sm {s.svc === 'nats' || s.svc === 'postgres'
										? 'bg-emerald-glow/60'
										: 'bg-cyan-glow/50'}"
									style="left: {s.start}%; width: {s.dur}%"
								></span>
							</span>
						</li>
					{/each}
				</ul>
			</div>

			<ol class="h-[9.5rem] space-y-0.5 overflow-hidden px-4 py-3" aria-live="off">
				{#each logs as l}
					<li class="flex gap-3 whitespace-pre">
						<span class="text-ink-faint">{l.t}</span>
						<span class={l.level === 'WARN' ? 'text-amber-300' : 'text-emerald-glow'}
							>{l.level}</span
						>
						<span class="truncate text-ink-muted">{l.msg}</span>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>
