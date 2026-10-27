// Every metric here comes from the CV / experiences.json, or is counted straight from the project's
// own repository (tests, routes, tables) — keep it that way: no invented numbers.

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
		id: 'employee-loan',
		featured: true,
		title: 'Employee Loan Platform (Koperasi SaaS)',
		org: 'independent build',
		period: '2026',
		summary:
			'Multi-tenant lending platform for an employee cooperative: members simulate and apply for loans, the employer and the cooperative approve in two tiers, and instalments are collected through payroll deduction.',
		metrics: [
			{ value: '534', label: 'Go tests on real Postgres' },
			{ value: '14', label: 'tables isolated by RLS' },
			{ value: '90', label: 'REST routes, role-tested' }
		],
		tags: [
			'Go',
			'PostgreSQL RLS',
			'Vue 3',
			'TypeScript',
			'Multi-tenant',
			'S3',
			'Prometheus',
			'Playwright'
		],
		diagram: {
			nodes: [
				{ id: 'member', label: 'members', x: 30, y: 45, kind: 'client' },
				{ id: 'admin', label: 'admins', x: 30, y: 115, kind: 'client' },
				{ id: 'spa', label: 'vue spa', x: 115, y: 80, kind: 'client' },
				{ id: 'rest', label: 'go-rest', x: 200, y: 50, kind: 'service' },
				{ id: 'worker', label: 'worker', x: 200, y: 125, kind: 'service' },
				{ id: 'pg', label: 'Postgres+RLS', x: 290, y: 90, kind: 'store' },
				{ id: 's3', label: 'S3 / MinIO', x: 290, y: 40, kind: 'infra' },
				{ id: 'prom', label: 'Prometheus', x: 290, y: 140, kind: 'obs' }
			],
			edges: [
				['member', 'spa'],
				['admin', 'spa'],
				['spa', 'rest'],
				['rest', 's3'],
				['rest', 'pg'],
				['worker', 'pg'],
				['worker', 'prom']
			]
		},
		problem:
			"Employees borrowing straight from their employer is untracked and hard to collect. A cooperative needed one source of truth for loans across many companies: who owes what, limits, instalments, and where the money came from, with zero chance of one company seeing another's data.",
		approach: [
			'Tenant isolation enforced by Postgres row-level security, not by discipline: the app connects as a restricted role and repositories only accept a transaction scoped with the tenant id.',
			'A pure loan-math package shared by the simulation endpoint and disbursement, so the schedule a member is shown is exactly the contract that gets stored; money is integer rupiah.',
			'Two-tier approval (employer, then cooperative), funding-source ledger with row locks on disbursement, payroll-deduction billing with invoices, and savings recorded at disbursement.',
			'Modular Go monolith with use-case interfaces between modules, a route table so the role matrix is testable as data, and a separate worker for reminders, email and cache checks.',
			'Operations built in: S3 file storage behind one validated interface, daily pg_dump backups to S3 with a guarded restore script, Prometheus metrics and fail2ban-style login rate limiting.'
		],
		outcome: [
			'534 Go tests run against a real Postgres, including an RLS suite proving tenant A can never read or write tenant B.',
			'Simulation-equals-contract guarded end to end: simulate → apply → two approvals → disburse produces the identical schedule.',
			'Vue 3 + TypeScript front end with 52 component specs and Playwright journeys; CI runs backend, frontend and e2e in parallel.'
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
		id: 'majelis',
		featured: true,
		title: "Majelis Maqbul Qur'ani: Member App & CMS",
		org: "Yayasan Majelis Maqbul Qur'ani",
		period: '2026',
		summary:
			'End-to-end digital platform for an Islamic foundation: a Flutter member app, a Vue admin CMS and the Go API behind both, covering study videos, programmes, quizzes, events, announcements and push notifications. Live on the web and Google Play.',
		metrics: [
			{ value: '3', label: 'apps: API, admin web, mobile' },
			{ value: '83', label: 'API endpoints' },
			{ value: 'v1.3', label: 'mobile release (build 9)' }
		],
		tags: ['Go', 'Gin', 'PostgreSQL', 'Flutter', 'Vue 3', 'AWS S3', 'FCM', 'OpenTelemetry'],
		diagram: {
			nodes: [
				{ id: 'app', label: 'flutter app', x: 30, y: 50, kind: 'client' },
				{ id: 'cms', label: 'vue admin', x: 30, y: 115, kind: 'client' },
				{ id: 'api', label: 'go api', x: 130, y: 85, kind: 'service' },
				{ id: 'pg', label: 'Postgres', x: 240, y: 35, kind: 'store' },
				{ id: 's3', label: 'S3 + CDN', x: 240, y: 70, kind: 'infra' },
				{ id: 'fcm', label: 'FCM / WA', x: 240, y: 105, kind: 'broker' },
				{ id: 'otel', label: 'OTel metrics', x: 240, y: 140, kind: 'obs' }
			],
			edges: [
				['app', 'api'],
				['cms', 'api'],
				['api', 'pg'],
				['api', 's3'],
				['api', 'fcm'],
				['api', 'otel']
			]
		},
		problem:
			"The foundation's members got videos, programme schedules and announcements through scattered chat groups. They needed one official app, and the staff needed to publish content without a developer.",
		approach: [
			'Go API on Gin in clean architecture (handler → use case → repository) with JWT auth, serving both the mobile app and the admin CMS.',
			'Media goes straight from the browser to S3 through presigned URLs and is served via CloudFront, so large videos and PDFs never pass through the API.',
			'Push notifications with Firebase Cloud Messaging (multicast, device-token lifecycle tied to login/logout) and deep links into announcements and programmes; WhatsApp delivers login codes on sign-up.',
			'Flutter app with video likes, view counts and watch-later, quizzes, an event calendar, an inbox with infinite scroll, and an in-app PDF reader for infographics.',
			'OpenTelemetry instrumentation on the Gin router exported to Prometheus.'
		],
		outcome: [
			'Live in production: the site at majelismaqbulqurani.org and the Android app on Google Play, now at v1.3 (build 9), with the API and admin CMS shipped alongside.',
			'Staff manage videos, programmes, quizzes, events, gallery, announcements and infographics from the CMS without touching code.',
			'Members get new content as a push notification that opens the right screen directly.'
		],
		links: [
			{ label: 'Website', href: 'https://majelismaqbulqurani.org/' },
			{
				label: 'Google Play',
				href: 'https://play.google.com/store/apps/details?id=com.majelismaqbulqurani.app'
			}
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
	{ value: '5s→100ms', label: 'ERP API latency', source: 'Laravel → Go rewrite', featured: true },
	{
		value: '−95%',
		label: 'student transfer time',
		source: '2–3 days → 1–2 hours',
		featured: true
	},
	{ value: '−60%', label: 'deployment time', source: 'GitLab CI optimisation' },
	{ value: '10', label: 'payment microservices', source: 'Payment-Finance squad' },
	{ value: '100%', label: 'unit-test coverage', source: 'on every service I own' },
	{ value: 'Top 10', label: 'Google Hackfest', source: 'of 700+ teams' }
];
