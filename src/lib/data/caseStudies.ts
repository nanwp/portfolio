// Every metric here comes from the CV / experiences.json — keep it that way: no invented numbers.

export type DiagramKind = 'client' | 'service' | 'broker' | 'store' | 'infra' | 'obs';

export interface CaseStudy {
	id: string;
	/** shown full-width with a larger diagram */
	featured?: boolean;
	title: string;
	org: string;
	period: string;
	summary: string;
	metrics: { value: string; label: string }[];
	tags: string[];
	diagram: {
		nodes: { id: string; label: string; x: number; y: number; kind: DiagramKind }[];
		edges: [string, string][];
	};
	problem: string;
	approach: string[];
	outcome: string[];
	links?: { label: string; href: string }[];
}

export const caseStudies: CaseStudy[] = [
	{
		id: 'payments',
		featured: true,
		title: 'Payment & Billing Platform',
		org: 'sekolah.mu',
		period: '2026 — now',
		summary:
			'Core payment and billing services for a high-traffic EdTech platform: learning-package checkout, voucher campaigns and billing management.',
		metrics: [
			{ value: '10', label: 'payment & billing services owned' },
			{ value: '100%', label: 'unit-test coverage' },
			{ value: '3', label: 'engineers I review MRs for' }
		],
		tags: ['Go', 'gRPC', 'NATS', 'Idempotency', 'PostgreSQL', 'MongoDB', 'Redis', 'Grafana'],
		diagram: {
			nodes: [
				{ id: 'client', label: 'checkout', x: 30, y: 80, kind: 'client' },
				{ id: 'billing', label: 'billing-svc', x: 120, y: 40, kind: 'service' },
				{ id: 'payment', label: 'payment-svc', x: 120, y: 120, kind: 'service' },
				{ id: 'nats', label: 'NATS', x: 210, y: 80, kind: 'broker' },
				{ id: 'psp', label: 'PSP gateways', x: 210, y: 140, kind: 'infra' },
				{ id: 'pg', label: 'Postgres', x: 290, y: 40, kind: 'store' },
				{ id: 'graf', label: 'Grafana', x: 290, y: 120, kind: 'obs' }
			],
			edges: [
				['client', 'billing'],
				['client', 'payment'],
				['billing', 'nats'],
				['payment', 'nats'],
				['payment', 'psp'],
				['nats', 'pg'],
				['nats', 'graf']
			]
		},
		problem:
			'Ten services in the Payment-Finance domain had to stay consistent with other squads while integrating several third-party payment gateways — and NATS worker failures were silently delaying transactions.',
		approach: [
			'Idempotent payment handlers, so retries and duplicate events never double-charge or double-apply a voucher.',
			'Go services on gRPC for synchronous calls and NATS / AsyncQueue for event-driven workflows across squads.',
			'Multiple third-party payment gateways integrated; PostgreSQL, MongoDB, Redis and Elasticsearch chosen per access pattern.',
			'Team-specific Grafana dashboards and alerting around worker throughput and process spikes.'
		],
		outcome: [
			'Silent NATS worker failures and process spikes now surface before they reach production users.',
			'On-call incidents (failed payment-request creation, missing price data, discount-calculation bugs) root-caused via logs, metrics and traces, and fixed with regression tests.',
			'100% unit-test coverage on owned services; payment-domain knowledge spread through code review for 3 peers.'
		]
	},
	{
		id: 'student-transfer',
		title: 'Student Transfer & Finance Tracking',
		org: 'sekolah.mu',
		period: '2025',
		summary:
			'Led end-to-end development of a full-stack financial tracking system that unified Operations and Finance for student transfers between branches.',
		metrics: [
			{ value: '−95%', label: 'transfer time' },
			{ value: '2–3d → 1–2h', label: 'per student transfer' },
			{ value: '100%', label: 'unit-test coverage' }
		],
		tags: ['Go', 'Vue.js', 'REST', 'PostgreSQL', 'Access control'],
		diagram: {
			nodes: [
				{ id: 'ops', label: 'Operations', x: 30, y: 50, kind: 'client' },
				{ id: 'fin', label: 'Finance', x: 30, y: 120, kind: 'client' },
				{ id: 'ui', label: 'vue app', x: 120, y: 85, kind: 'client' },
				{ id: 'api', label: 'go-api', x: 205, y: 85, kind: 'service' },
				{ id: 'calc', label: 'reconcile', x: 290, y: 50, kind: 'service' },
				{ id: 'pg', label: 'Postgres', x: 290, y: 120, kind: 'store' }
			],
			edges: [
				['ops', 'ui'],
				['fin', 'ui'],
				['ui', 'api'],
				['api', 'calc'],
				['api', 'pg']
			]
		},
		problem:
			'Moving a student between branches took 2–3 days of manual cross-checking between Operations and Finance: utilised vs forfeited funds and price adjustments were validated by hand.',
		approach: [
			'Go REST APIs with strict access control so every financial change is auditable.',
			'Automated cross-checking and revenue calculation across branches.',
			'One Vue.js platform for both departments with one-click approvals.'
		],
		outcome: [
			'Transfer time cut by over 95%, from 2–3 days to 1–2 hours.',
			'Error-prone manual validation eliminated; 100% unit-test coverage for financial auditability.'
		]
	},
	{
		id: 'erp',
		title: 'ERP Migration: Laravel → Go',
		org: 'Busanid Techno Asia',
		period: '2024 — 2025',
		summary:
			'Rewrote hot paths of a legacy Laravel ERP in Go, eliminating N+1 queries and adding OpenTelemetry tracing end to end.',
		metrics: [
			{ value: '5s → 100ms', label: 'API response time' },
			{ value: '50×', label: 'faster' },
			{ value: 'N+1', label: 'queries eliminated' }
		],
		tags: ['Go', 'PostgreSQL', 'OpenTelemetry', 'Docker'],
		diagram: {
			nodes: [
				{ id: 'pos', label: 'POS / web', x: 30, y: 80, kind: 'client' },
				{ id: 'api', label: 'go-erp-api', x: 130, y: 80, kind: 'service' },
				{ id: 'legacy', label: 'legacy php', x: 130, y: 140, kind: 'infra' },
				{ id: 'pg', label: 'Postgres', x: 240, y: 50, kind: 'store' },
				{ id: 'otel', label: 'OTel traces', x: 240, y: 120, kind: 'obs' }
			],
			edges: [
				['pos', 'api'],
				['api', 'pg'],
				['api', 'otel'],
				['pos', 'legacy']
			]
		},
		problem:
			'ERP endpoints took around 5 seconds to respond because the ORM issued one query per row (N+1), making the system hard to scale with more outlets.',
		approach: [
			'Traced slow endpoints with OpenTelemetry to find the query fan-out.',
			'Re-implemented the services in Go with hand-written, set-based PostgreSQL queries.',
			'Migrated endpoint by endpoint so the legacy app kept serving the rest.'
		],
		outcome: [
			'Response time cut from ~5s to ~100ms.',
			'A traced, containerised service that scales with outlet count.'
		]
	},
	{
		id: 'aws-ecommerce',
		title: 'E-commerce Cloud Platform',
		org: 'Apotek Roxy',
		period: '2025',
		summary:
			'Designed the AWS architecture, Kubernetes deployment workflow and observability stack for a newly launched customer-facing e-commerce platform.',
		metrics: [
			{ value: '−60%', label: 'deployment time' },
			{ value: 'auto', label: 'scaling for spikes' },
			{ value: 'LGTM', label: 'Loki · Grafana · Prom' }
		],
		tags: ['AWS', 'Kubernetes', 'Helm', 'Docker', 'GitLab CI', 'Prometheus'],
		diagram: {
			nodes: [
				{ id: 'users', label: 'shoppers', x: 30, y: 80, kind: 'client' },
				{ id: 'alb', label: 'ALB', x: 110, y: 80, kind: 'infra' },
				{ id: 'k8s', label: 'k8s services', x: 195, y: 50, kind: 'service' },
				{ id: 'ecs', label: 'ECS / EC2', x: 195, y: 120, kind: 'service' },
				{ id: 'rds', label: 'RDS', x: 285, y: 50, kind: 'store' },
				{ id: 'obs', label: 'Grafana', x: 285, y: 120, kind: 'obs' }
			],
			edges: [
				['users', 'alb'],
				['alb', 'k8s'],
				['alb', 'ecs'],
				['k8s', 'rds'],
				['ecs', 'rds'],
				['k8s', 'obs']
			]
		},
		problem:
			'A brand-new e-commerce platform needed to be highly available from launch, absorb traffic spikes, and let the team ship features quickly.',
		approach: [
			'AWS architecture on ECS, EC2, RDS and ALB.',
			'Microservices deployed with Helm charts and Kubernetes manifests, with auto-scaling for traffic spikes.',
			'Grafana, Prometheus and Loki for real-time traffic monitoring and anomaly detection.',
			'Optimised GitLab CI pipelines for continuous releases.'
		],
		outcome: [
			'Deployment time reduced by 60%.',
			'Real-time visibility into traffic and anomalies from day one.'
		]
	},
	{
		id: 'retail-sync',
		title: 'Real-time Retail Sync',
		org: 'Busanid Techno Asia',
		period: '2024',
		summary:
			'Event-driven transaction and stock synchronisation across retail outlets using Kafka and per-outlet microservices.',
		metrics: [
			{ value: 'real-time', label: 'stock + transactions' },
			{ value: 'per-outlet', label: 'service isolation' },
			{ value: 'Kafka', label: 'event backbone' }
		],
		tags: ['Go', 'Kafka', 'Docker', 'Microservices'],
		diagram: {
			nodes: [
				{ id: 'o1', label: 'outlet-a', x: 30, y: 40, kind: 'client' },
				{ id: 'o2', label: 'outlet-b', x: 30, y: 120, kind: 'client' },
				{ id: 'kafka', label: 'Kafka', x: 140, y: 80, kind: 'broker' },
				{ id: 'sync', label: 'sync-svc', x: 240, y: 50, kind: 'service' },
				{ id: 'db', label: 'central DB', x: 240, y: 120, kind: 'store' }
			],
			edges: [
				['o1', 'kafka'],
				['o2', 'kafka'],
				['kafka', 'sync'],
				['sync', 'db']
			]
		},
		problem:
			'Transactions and stock levels had to stay consistent across many retail outlets without a single central bottleneck.',
		approach: [
			'Each outlet publishes transaction and stock events to Kafka.',
			'Per-outlet microservices, packaged with Docker, consume and reconcile state centrally.'
		],
		outcome: ['Stock and transactions propagate across outlets in real time.'],
		links: [
			{ label: 'Read the write-up', href: '/blog/real-time-retail-sync' },
			{
				label: 'Medium',
				href: 'https://medium.com/@nanwp/real-time-retail-data-synchronization-e5e4147d32c2'
			}
		]
	}
];

export const impact = [
	{ value: '5s→100ms', label: 'ERP API latency', source: 'Laravel → Go rewrite' },
	{ value: '−95%', label: 'student transfer time', source: '2–3 days → 1–2 hours' },
	{ value: '−60%', label: 'deployment time', source: 'GitLab CI optimisation' },
	{ value: '10', label: 'payment microservices', source: 'Payment-Finance squad' },
	{ value: '100%', label: 'unit-test coverage', source: 'on every service I own' },
	{ value: 'Top 10', label: 'Google Hackfest', source: 'of 700+ teams' }
];
