/** Slabs of the 3D core, bottom to top. Lives here (not in the scene) so the DOM never imports three. */
export const LAYERS = [
	'Cloud / K8s',
	'Data Clusters',
	'Message Brokers',
	'Backend Services'
] as const;

export interface StackGroup {
	id: string;
	title: string;
	/** which slab of the 3D core this maps to */
	layer: string;
	blurb: string;
	accent: 'cyan' | 'emerald' | 'steel';
	/** bento grid placement on lg screens */
	span: string;
	items: { name: string; note: string }[];
}

export const stack: StackGroup[] = [
	{
		id: 'backend',
		title: 'Core Backend',
		layer: 'L4 · services',
		blurb: 'Typed, observable services that talk over gRPC and event streams.',
		accent: 'cyan',
		span: 'lg:col-span-4 lg:row-span-2',
		items: [
			{ name: 'Go', note: 'primary · Echo, Gin' },
			{ name: 'gRPC + Protobuf', note: 'service-to-service' },
			{ name: 'NATS', note: 'idempotent consumers' },
			{ name: 'Kafka / Pub/Sub', note: 'event streams' },
			{ name: 'TypeScript', note: 'APIs, Vue, Next.js' },
			{ name: 'Elysia / Bun', note: 'edge-fast HTTP' },
			{ name: 'REST', note: 'access-controlled APIs' },
			{ name: 'Python', note: 'scripts, data' }
		]
	},
	{
		id: 'cloud',
		title: 'Cloud & DevOps',
		layer: 'L1 · platform',
		blurb: 'Reproducible infrastructure and pipelines that ship many times a day.',
		accent: 'steel',
		span: 'lg:col-span-2 lg:row-span-2',
		items: [
			{ name: 'Docker', note: 'everything ships as an image' },
			{ name: 'Kubernetes / k3s', note: 'Helm, manifests' },
			{ name: 'AWS', note: 'ECS · EC2 · RDS · ALB' },
			{ name: 'CI/CD', note: 'GitLab CI · −60% deploy time' },
			{ name: 'Nginx / DNS', note: 'edge + routing' }
		]
	},
	{
		id: 'data',
		title: 'Data & Storage',
		layer: 'L2 · state',
		blurb: 'Picking the right store for each access pattern.',
		accent: 'emerald',
		span: 'lg:col-span-3',
		items: [
			{ name: 'PostgreSQL / MySQL', note: 'source of truth' },
			{ name: 'Redis', note: 'cache, locks' },
			{ name: 'MongoDB', note: 'documents' },
			{ name: 'Elasticsearch', note: 'search' }
		]
	},
	{
		id: 'observability',
		title: 'Observability',
		layer: 'L3 · signals',
		blurb: 'Logs, metrics and traces wired in from day one, not bolted on.',
		accent: 'emerald',
		span: 'lg:col-span-3',
		items: [
			{ name: 'OpenTelemetry', note: 'distributed tracing' },
			{ name: 'Grafana', note: 'dashboards, alerts' },
			{ name: 'Prometheus', note: 'metrics' },
			{ name: 'Loki', note: 'logs · LogQL' }
		]
	}
];
