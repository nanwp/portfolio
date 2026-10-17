// Single source for the facts recruiters look for. Mirrors the CV in static/Nanda_Wijaya_Putra_CV.pdf.

export const profile = {
	name: 'Nanda Wijaya Putra',
	title: 'Software Engineer — Distributed Systems, Payments & Observability',
	shortTitle: 'Backend Software Engineer',
	location: 'Jakarta, Indonesia',
	timezone: 'UTC+7',
	yearsExperience: 3,
	current: { role: 'Backend Engineer', company: 'Sekolah.mu' },
	email: 'nanwp.dev@gmail.com',
	resumeUrl: '/Nanda_Wijaya_Putra_CV.pdf',
	availability: 'Open to remote roles & relocation with visa sponsorship',
	relocation: ['SG', 'JP', 'AU', 'MY', 'UK'],
	summary:
		'Backend engineer with 3 years of experience building Go microservices for payment, billing, and high-traffic consumer platforms. Strong in distributed systems (gRPC, NATS, Kafka), production observability (OpenTelemetry, Prometheus, Grafana), and cloud-native delivery on AWS and Kubernetes.',
	links: {
		github: 'https://github.com/nanwp',
		linkedin: 'https://linkedin.com/in/nanwp',
		medium: 'https://medium.com/@nanwp'
	}
} as const;
