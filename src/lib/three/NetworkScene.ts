import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { LAYERS } from '$lib/data/stack';

/**
 * Abstract distributed-system topology: metallic service nodes around a layered core,
 * linked by fibre splines that carry glowing "packets".
 *
 * The scene is driven entirely by `state` (camera + effect parameters). GSAP tweens
 * `state` from outside on scroll; the render loop only reads it, so the scene has no
 * knowledge of the DOM or of scrolling.
 */

export type StageName = 'hero' | 'architecture' | 'telemetry' | 'work' | 'outro';

export interface SceneState {
	camX: number;
	camY: number;
	camZ: number;
	lookX: number;
	lookY: number;
	lookZ: number;
	/** 0 = compact core, 1 = core split into its four layers */
	explode: number;
	/** 0..1 strength of telemetry pulses on nodes */
	telemetry: number;
	/** horizontal frame offset as a fraction of viewport width (moves cluster sideways) */
	shift: number;
	/** 0..1 how far the canvas recedes behind content */
	dim: number;
}

export const STAGES: Record<StageName, SceneState> = {
	hero: {
		camX: 0,
		camY: 3.2,
		camZ: 19,
		lookX: 0,
		lookY: 0,
		lookZ: 0,
		explode: 0,
		telemetry: 0,
		shift: 0.2,
		dim: 0
	},
	architecture: {
		camX: 3,
		camY: 2.2,
		camZ: 11.5,
		lookX: 0,
		lookY: 0.3,
		lookZ: 0,
		explode: 1,
		telemetry: 0,
		shift: 0.22,
		dim: 0.18
	},
	telemetry: {
		camX: -8,
		camY: 5.5,
		camZ: 12,
		lookX: 0,
		lookY: 0,
		lookZ: 0,
		explode: 0.15,
		telemetry: 1,
		shift: 0.24,
		dim: 0.3
	},
	work: {
		camX: 13,
		camY: 1.2,
		camZ: 12,
		lookX: 6,
		lookY: 0,
		lookZ: 0,
		explode: 0,
		telemetry: 0.35,
		shift: 0,
		dim: 0.55
	},
	outro: {
		camX: 0,
		camY: 9,
		camZ: 30,
		lookX: 0,
		lookY: 0,
		lookZ: 0,
		explode: 0,
		telemetry: 0,
		shift: 0,
		dim: 0.82
	}
};

export { LAYERS };

export interface SceneOptions {
	reducedMotion?: boolean;
	quality?: 'high' | 'low';
}

const CYAN = new THREE.Color('#00F0FF');
const EMERALD = new THREE.Color('#10B981');
const STEEL = new THREE.Color('#9aa0ab');

const glowVertex = /* glsl */ `
	attribute float aSize;
	attribute float aAlpha;
	attribute vec3 aColor;
	uniform float uPixelRatio;
	uniform float uOpacity;
	varying vec3 vColor;
	varying float vAlpha;
	void main() {
		vec4 mv = modelViewMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * mv;
		gl_PointSize = aSize * uPixelRatio * (22.0 / -mv.z);
		vColor = aColor;
		vAlpha = aAlpha * uOpacity;
	}
`;

const glowFragment = /* glsl */ `
	varying vec3 vColor;
	varying float vAlpha;
	void main() {
		float d = length(gl_PointCoord - 0.5);
		float a = pow(smoothstep(0.5, 0.0, d), 2.4);
		gl_FragColor = vec4(vColor * (1.0 + a), a * vAlpha);
	}
`;

function glowMaterial(pixelRatio: number) {
	return new THREE.ShaderMaterial({
		vertexShader: glowVertex,
		fragmentShader: glowFragment,
		uniforms: { uPixelRatio: { value: pixelRatio }, uOpacity: { value: 1 } },
		transparent: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});
}

/** Deterministic PRNG so the topology is identical on every visit. */
function mulberry32(seed: number) {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

interface ServiceNode {
	mesh: THREE.Group;
	base: THREE.Vector3;
	pulsePhase: number;
	focus: number;
}

interface Slab {
	mesh: THREE.Group;
	body: THREE.MeshStandardMaterial;
	edge: THREE.LineBasicMaterial;
	radius: number;
	compactY: number;
	explodedY: number;
	/** 0..1 eased highlight from setLayer() */
	focus: number;
}

interface Packet {
	curve: number;
	t: number;
	speed: number;
	color: THREE.Color;
}

const TRAIL = 3;

export class NetworkScene {
	readonly state: SceneState = { ...STAGES.hero };

	private renderer: THREE.WebGLRenderer;
	private scene = new THREE.Scene();
	private camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
	private cluster = new THREE.Group();
	private core = new THREE.Group();
	private nodes: ServiceNode[] = [];
	private slabs: Slab[] = [];
	private curves: THREE.QuadraticBezierCurve3[] = [];
	private packets: Packet[] = [];
	private packetGeo!: THREE.BufferGeometry;
	private ledGeo!: THREE.BufferGeometry;
	private rings: { mesh: THREE.Mesh; node: number; phase: number }[] = [];
	private fibreMat!: THREE.LineBasicMaterial;
	private glowMats: THREE.ShaderMaterial[] = [];
	private disposables: { dispose(): void }[] = [];

	private pointer = new THREE.Vector2();
	private pointerSmooth = new THREE.Vector2();
	private look = new THREE.Vector3();
	private clock = new THREE.Clock(false);
	private raf = 0;
	private running = false;
	private width = 1;
	private height = 1;
	private pixelRatio = 1;
	private frameTimes: number[] = [];
	private lastStateKey = '';
	private focusIndex: number | null = null;
	private layerIndex: number | null = null;
	private labels: HTMLElement[] = [];
	private occluders: Element[] = [];
	private tmp = new THREE.Vector3();
	private camRight = new THREE.Vector3();
	private readonly reducedMotion: boolean;
	private readonly quality: 'high' | 'low';

	/** Node indices that anchor the project case studies in the "work" stage. */
	static readonly ANCHORS = [2, 9, 17, 24, 28];

	constructor(
		private canvas: HTMLCanvasElement,
		opts: SceneOptions = {}
	) {
		this.reducedMotion = !!opts.reducedMotion;
		this.quality = opts.quality ?? 'high';

		this.renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: this.quality === 'high',
			alpha: true,
			powerPreference: 'high-performance'
		});
		this.renderer.setClearColor(0x000000, 0);
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.pixelRatio = Math.min(window.devicePixelRatio, this.quality === 'high' ? 1.75 : 1);
		this.renderer.setPixelRatio(this.pixelRatio);

		const pmrem = new THREE.PMREMGenerator(this.renderer);
		const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
		this.scene.environment = env;
		this.scene.environmentIntensity = 0.6;
		this.scene.fog = new THREE.FogExp2(0x070709, 0.028);
		this.disposables.push(env, pmrem);

		this.scene.add(new THREE.AmbientLight(0xffffff, 0.35));
		const key = new THREE.DirectionalLight(0xffffff, 1.6);
		key.position.set(6, 10, 8);
		// cyan rim from behind so dark metal reads as a silhouette against the near-black page
		const rim = new THREE.DirectionalLight(CYAN, 2.4);
		rim.position.set(-8, 5, -12);
		this.scene.add(key, rim);
		const coreLight = new THREE.PointLight(CYAN, 18, 14, 1.6);
		this.core.add(coreLight);

		this.scene.add(this.cluster);
		this.cluster.add(this.core);

		this.buildCore();
		this.buildNodes();
		this.buildFibres();
		this.buildPackets();
		this.buildRings();
		this.buildAmbient();

		this.resize();
		this.applyState(0, 0);
	}

	// ── construction ────────────────────────────────────────────────────────────

	private buildCore() {
		const accents = [STEEL, CYAN, EMERALD, CYAN];
		for (let i = 0; i < LAYERS.length; i++) {
			const r = 1.75 - i * 0.18;
			const geo = new THREE.CylinderGeometry(r, r, 0.2, 8, 1);
			const mat = new THREE.MeshStandardMaterial({
				color: 0x1c1e26,
				metalness: 0.9,
				roughness: 0.3,
				emissive: accents[i],
				emissiveIntensity: 0
			});
			const edges = new THREE.EdgesGeometry(geo);
			const edgeMat = new THREE.LineBasicMaterial({
				color: accents[i],
				transparent: true,
				opacity: 0.8
			});
			const group = new THREE.Group();
			group.add(new THREE.Mesh(geo, mat), new THREE.LineSegments(edges, edgeMat));
			group.rotation.y = (i * Math.PI) / 8;
			this.core.add(group);
			this.slabs.push({
				mesh: group,
				body: mat,
				edge: edgeMat,
				radius: r,
				compactY: (i - 1.5) * 0.3,
				explodedY: (i - 1.5) * 1.35,
				focus: 0
			});
			this.disposables.push(geo, mat, edges, edgeMat);
		}
	}

	private buildNodes() {
		const rand = mulberry32(42);
		const count = this.quality === 'high' ? 30 : 18;
		const geos = [
			new THREE.BoxGeometry(0.55, 0.55, 0.55),
			new THREE.OctahedronGeometry(0.42),
			new THREE.IcosahedronGeometry(0.38, 0)
		];
		const edgeGeos = geos.map((g) => new THREE.EdgesGeometry(g));
		const bodyMat = new THREE.MeshStandardMaterial({
			color: 0x23252e,
			metalness: 0.95,
			roughness: 0.28
		});
		const edgeMat = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.3
		});
		this.disposables.push(...geos, ...edgeGeos, bodyMat, edgeMat);

		const golden = Math.PI * (3 - Math.sqrt(5));
		for (let i = 0; i < count; i++) {
			// Fibonacci sphere, flattened into a disc-ish cluster
			const y = 1 - (i / (count - 1)) * 2;
			const ring = Math.sqrt(1 - y * y);
			const theta = golden * i;
			const radius = 5 + rand() * 3.2;
			const base = new THREE.Vector3(
				Math.cos(theta) * ring * radius,
				y * radius * 0.42,
				Math.sin(theta) * ring * radius
			);

			const kind = Math.floor(rand() * geos.length);
			const group = new THREE.Group();
			group.add(
				new THREE.Mesh(geos[kind], bodyMat),
				new THREE.LineSegments(edgeGeos[kind], edgeMat)
			);
			group.position.copy(base);
			group.rotation.set(rand() * Math.PI, rand() * Math.PI, 0);
			this.cluster.add(group);
			this.nodes.push({ mesh: group, base, pulsePhase: rand(), focus: 0 });
		}

		// one status LED per node, drawn as a single points cloud
		this.ledGeo = new THREE.BufferGeometry();
		const pos = new Float32Array(count * 3);
		const col = new Float32Array(count * 3);
		const size = new Float32Array(count);
		const alpha = new Float32Array(count);
		for (let i = 0; i < count; i++) {
			(rand() > 0.3 ? EMERALD : CYAN).toArray(col, i * 3);
			size[i] = 3;
			alpha[i] = 0.9;
		}
		this.ledGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		this.ledGeo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
		this.ledGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
		this.ledGeo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
		const mat = glowMaterial(this.pixelRatio);
		this.glowMats.push(mat);
		this.cluster.add(new THREE.Points(this.ledGeo, mat));
		this.disposables.push(this.ledGeo, mat);
	}

	private buildFibres() {
		const origin = new THREE.Vector3();
		const seen = new Set<string>();
		const link = (a: THREE.Vector3, b: THREE.Vector3) => {
			const mid = a.clone().add(b).multiplyScalar(0.5);
			const lift = mid
				.clone()
				.normalize()
				.multiplyScalar(0.9)
				.add(new THREE.Vector3(0, 0.6, 0));
			this.curves.push(new THREE.QuadraticBezierCurve3(a.clone(), mid.add(lift), b.clone()));
		};

		this.nodes.forEach((n, i) => {
			const nearest = this.nodes
				.map((m, j) => ({ j, d: n.base.distanceToSquared(m.base) }))
				.filter((x) => x.j !== i)
				.sort((x, y) => x.d - y.d)
				.slice(0, 2);
			for (const { j } of nearest) {
				const k = i < j ? `${i}-${j}` : `${j}-${i}`;
				if (seen.has(k)) continue;
				seen.add(k);
				link(n.base, this.nodes[j].base);
			}
			if (i % 3 === 0) link(n.base, origin);
		});

		const SEG = 24;
		const positions = new Float32Array(this.curves.length * SEG * 2 * 3);
		let o = 0;
		const p = new THREE.Vector3();
		for (const c of this.curves) {
			for (let s = 0; s < SEG; s++) {
				c.getPoint(s / SEG, p).toArray(positions, o);
				c.getPoint((s + 1) / SEG, p).toArray(positions, o + 3);
				o += 6;
			}
		}
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		this.fibreMat = new THREE.LineBasicMaterial({
			color: CYAN,
			transparent: true,
			opacity: 0.14,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		});
		this.cluster.add(new THREE.LineSegments(geo, this.fibreMat));
		this.disposables.push(geo, this.fibreMat);
	}

	private buildPackets() {
		const rand = mulberry32(7);
		const count = this.quality === 'high' ? 140 : 60;
		for (let i = 0; i < count; i++) {
			this.packets.push({
				curve: Math.floor(rand() * this.curves.length),
				t: rand(),
				speed: 0.12 + rand() * 0.28,
				color: rand() > 0.35 ? CYAN : EMERALD
			});
		}

		const n = count * TRAIL;
		this.packetGeo = new THREE.BufferGeometry();
		const size = new Float32Array(n);
		const alpha = new Float32Array(n);
		for (let i = 0; i < count; i++) {
			for (let k = 0; k < TRAIL; k++) {
				size[i * TRAIL + k] = 2.6 - k * 0.7;
				alpha[i * TRAIL + k] = 1 - k * 0.32;
			}
		}
		this.packetGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
		this.packetGeo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
		this.packetGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
		this.packetGeo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
		const mat = glowMaterial(this.pixelRatio);
		this.glowMats.push(mat);
		const points = new THREE.Points(this.packetGeo, mat);
		points.frustumCulled = false;
		this.cluster.add(points);
		this.disposables.push(this.packetGeo, mat);
	}

	private buildRings() {
		const geo = new THREE.RingGeometry(0.62, 0.66, 48);
		this.disposables.push(geo);
		const picks = this.nodes
			.map((_, i) => i)
			.filter((i) => i % 4 === 1 || NetworkScene.ANCHORS.includes(i));
		for (const node of picks) {
			const mat = new THREE.MeshBasicMaterial({
				color: EMERALD,
				transparent: true,
				opacity: 0,
				blending: THREE.AdditiveBlending,
				depthWrite: false,
				side: THREE.DoubleSide
			});
			const mesh = new THREE.Mesh(geo, mat);
			this.cluster.add(mesh);
			this.rings.push({ mesh, node, phase: this.nodes[node].pulsePhase });
			this.disposables.push(mat);
		}
	}

	private buildAmbient() {
		const rand = mulberry32(99);
		const count = this.quality === 'high' ? 600 : 250;
		const pos = new Float32Array(count * 3);
		const col = new Float32Array(count * 3);
		const size = new Float32Array(count);
		const alpha = new Float32Array(count);
		for (let i = 0; i < count; i++) {
			const r = 14 + rand() * 30;
			const th = rand() * Math.PI * 2;
			const ph = Math.acos(2 * rand() - 1);
			pos.set(
				[r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.6, r * Math.sin(ph) * Math.sin(th)],
				i * 3
			);
			STEEL.toArray(col, i * 3);
			size[i] = 0.6 + rand() * 1.2;
			alpha[i] = 0.25 + rand() * 0.35;
		}
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
		geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
		geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
		const mat = glowMaterial(this.pixelRatio);
		this.glowMats.push(mat);
		this.scene.add(new THREE.Points(geo, mat));

		const grid = new THREE.PolarGridHelper(16, 16, 10, 64, 0x2a2d36, 0x1a1c22);
		grid.position.y = -4.2;
		(grid.material as THREE.Material).transparent = true;
		(grid.material as THREE.Material).opacity = 0.5;
		this.scene.add(grid);
		this.disposables.push(geo, mat, grid);
	}

	// ── public api ───────────────────────────────────────────────────────────────

	start() {
		if (this.running) return;
		this.running = true;
		this.clock.start();
		window.addEventListener('pointermove', this.onPointer, { passive: true });
		window.addEventListener('resize', this.resize);
		document.addEventListener('visibilitychange', this.onVisibility);
		this.loop();
	}

	stop() {
		this.running = false;
		this.clock.stop();
		cancelAnimationFrame(this.raf);
	}

	/** Highlight the node anchoring project `i` (or clear with null). */
	setFocus(i: number | null) {
		this.focusIndex =
			i === null ? null : NetworkScene.ANCHORS[i % NetworkScene.ANCHORS.length] % this.nodes.length;
	}

	/** Light up core slab `i` (0 = bottom, matching LAYERS) and dim the rest; null clears. */
	setLayer(i: number | null) {
		this.layerIndex = i;
	}

	/** One element per LAYERS entry; positioned each frame beside its slab while the core is exploded. */
	setLabels(els: HTMLElement[], occluders: Element[] = []) {
		this.labels = els;
		this.occluders = occluders;
		this.lastStateKey = '';
	}

	dispose() {
		this.stop();
		window.removeEventListener('pointermove', this.onPointer);
		window.removeEventListener('resize', this.resize);
		document.removeEventListener('visibilitychange', this.onVisibility);
		for (const d of this.disposables) d.dispose();
		this.renderer.dispose();
	}

	// ── loop ─────────────────────────────────────────────────────────────────────

	private onPointer = (e: PointerEvent) => {
		if (e.pointerType !== 'mouse') return;
		this.pointer.set(
			(e.clientX / window.innerWidth) * 2 - 1,
			(e.clientY / window.innerHeight) * 2 - 1
		);
	};

	private onVisibility = () => {
		if (document.hidden) this.stop();
		else this.start();
	};

	private resize = () => {
		const parent = this.canvas.parentElement ?? document.body;
		this.width = parent.clientWidth;
		this.height = parent.clientHeight;
		this.renderer.setSize(this.width, this.height, false);
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
		this.lastStateKey = '';
	};

	private loop = () => {
		if (!this.running) return;
		this.raf = requestAnimationFrame(this.loop);
		const dt = Math.min(this.clock.getDelta(), 0.05);
		const t = this.clock.elapsedTime;

		if (this.reducedMotion) {
			// Only re-render when scroll changes the state; nothing animates on its own.
			const key =
				Object.values(this.state)
					.map((v) => v.toFixed(3))
					.join() + `|${this.layerIndex}`;
			if (key === this.lastStateKey) return;
			this.lastStateKey = key;
			this.applyState(0, t);
		} else {
			this.applyState(dt, t);
		}

		this.renderer.render(this.scene, this.camera);
		this.trackPerformance(dt);
	};

	private applyState(dt: number, t: number) {
		const s = this.state;

		// camera + pointer parallax
		this.pointerSmooth.lerp(this.pointer, 1 - Math.pow(0.0015, dt || 1));
		const px = this.pointerSmooth.x * 1.4;
		const py = -this.pointerSmooth.y * 0.9;
		this.camera.position.set(s.camX + px, s.camY + py, s.camZ);
		this.look.set(s.lookX, s.lookY, s.lookZ);
		this.camera.lookAt(this.look);

		// shift the frame sideways so the cluster sits beside the copy on wide screens
		const shift = this.width / this.height > 1.15 ? s.shift : 0;
		if (shift)
			this.camera.setViewOffset(
				this.width,
				this.height,
				-this.width * shift,
				0,
				this.width,
				this.height
			);
		else this.camera.clearViewOffset();

		this.cluster.rotation.y += dt * 0.035;

		// core layers separate along Y; a hovered layer glows while the others step back
		const ease = dt ? Math.min(1, dt * 8) : 1;
		const anyLayer = this.layerIndex !== null;
		this.slabs.forEach((slab, i) => {
			slab.focus += ((this.layerIndex === i ? 1 : 0) - slab.focus) * ease;
			slab.mesh.position.y = THREE.MathUtils.lerp(slab.compactY, slab.explodedY, s.explode);
			slab.mesh.rotation.y += dt * 0.12 * (slab.compactY > 0 ? 1 : -1) * (0.3 + s.explode);
			slab.mesh.scale.setScalar(1 + slab.focus * 0.08);
			slab.body.emissiveIntensity = slab.focus * 0.5;
			slab.edge.opacity = (anyLayer ? 0.3 : 0.8) + slab.focus * 0.7;
		});

		// satellites drift outwards and dim while the core is exploded
		const ledPos = this.ledGeo.attributes.position as THREE.BufferAttribute;
		const ledSize = this.ledGeo.attributes.aSize as THREE.BufferAttribute;
		const ledAlpha = this.ledGeo.attributes.aAlpha as THREE.BufferAttribute;
		this.nodes.forEach((n, i) => {
			const focused = this.focusIndex === i ? 1 : 0;
			n.focus += (focused - n.focus) * Math.min(1, dt * 6);
			const push = 1 + s.explode * 0.15;
			n.mesh.position.copy(n.base).multiplyScalar(push);
			n.mesh.position.y += Math.sin(t * 0.6 + n.pulsePhase * 6.28) * 0.12;
			n.mesh.rotation.x += dt * 0.15;
			n.mesh.rotation.y += dt * 0.1;
			n.mesh.scale.setScalar(1 + n.focus * 0.7);

			ledPos.setXYZ(
				i,
				n.mesh.position.x,
				n.mesh.position.y + 0.55 + n.focus * 0.3,
				n.mesh.position.z
			);
			const blink = 0.55 + 0.45 * Math.sin(t * 3 + n.pulsePhase * 20) * s.telemetry;
			ledSize.setX(i, 3 + n.focus * 5);
			ledAlpha.setX(i, (0.6 + 0.4 * blink) * (1 - s.explode * 0.5) + n.focus);
		});
		ledPos.needsUpdate = ledSize.needsUpdate = ledAlpha.needsUpdate = true;

		// telemetry rings expand from nodes and face the camera
		for (const r of this.rings) {
			const n = this.nodes[r.node];
			const phase = (t * 0.45 + r.phase) % 1;
			const strength = Math.max(s.telemetry, n.focus);
			r.mesh.position.copy(n.mesh.position);
			r.mesh.quaternion.copy(this.camera.quaternion);
			r.mesh.scale.setScalar(0.8 + phase * 1.5);
			(r.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.4 * strength;
		}

		// packets travel along fibres; telemetry makes traffic hotter
		const speedMul = 1 + s.telemetry * 0.8;
		const pos = this.packetGeo.attributes.position as THREE.BufferAttribute;
		const col = this.packetGeo.attributes.aColor as THREE.BufferAttribute;
		const p = new THREE.Vector3();
		this.packets.forEach((pk, i) => {
			pk.t += dt * pk.speed * speedMul * 0.5;
			if (pk.t > 1) {
				pk.t = 0;
				pk.curve = (pk.curve + 7 + i) % this.curves.length;
			}
			const curve = this.curves[pk.curve];
			for (let k = 0; k < TRAIL; k++) {
				curve.getPoint(Math.max(0, pk.t - k * 0.018), p);
				p.multiplyScalar(1 + s.explode * 0.15 * Math.min(1, p.length() / 4));
				pos.setXYZ(i * TRAIL + k, p.x, p.y, p.z);
				col.setXYZ(i * TRAIL + k, pk.color.r, pk.color.g, pk.color.b);
			}
		});
		pos.needsUpdate = col.needsUpdate = true;

		this.fibreMat.opacity = 0.14 * (1 - s.explode * 0.5) + s.telemetry * 0.06;
		// on portrait / square screens the cluster sits behind the copy, so keep it quieter
		const wide = this.width / this.height > 1.15;
		const minDim = wide ? 0 : 0.45;
		const visible = 1 - Math.max(s.dim, minDim);
		this.canvas.style.opacity = String(visible);
		this.placeLabels(wide ? THREE.MathUtils.smoothstep(s.explode, 0.55, 0.95) * visible : 0);
	}

	/** Pin each layer label just right of its slab's silhouette, in screen space. */
	private placeLabels(opacity: number) {
		if (!this.labels.length) return;
		this.camera.updateMatrixWorld();
		this.camRight.setFromMatrixColumn(this.camera.matrixWorld, 0);
		// read layout before writing styles; labels hide while a content card covers them
		const rects = opacity > 0 ? this.occluders.map((o) => o.getBoundingClientRect()) : [];
		const widths = opacity > 0 ? this.labels.map((l) => l.offsetWidth) : [];
		this.slabs.forEach((slab, i) => {
			const el = this.labels[i];
			if (!el) return;
			el.dataset.active = String(slab.focus > 0.5);
			if (opacity === 0) return void (el.style.opacity = '0');
			slab.mesh.getWorldPosition(this.tmp);
			this.tmp.addScaledVector(this.camRight, slab.radius * slab.mesh.scale.x * 1.08);
			this.tmp.project(this.camera);
			const x = ((this.tmp.x + 1) / 2) * this.width;
			const y = ((1 - this.tmp.y) / 2) * this.height;
			const covered = rects.some(
				(r) => y > r.top - 8 && y < r.bottom + 8 && x + widths[i] > r.left && x < r.right
			);
			el.style.opacity = covered ? '0' : opacity.toFixed(3);
			el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translateY(-50%)`;
		});
	}

	/** Drop to 1x pixel ratio if the device can't hold ~45fps. */
	private trackPerformance(dt: number) {
		if (this.pixelRatio <= 1 || dt === 0) return;
		this.frameTimes.push(dt);
		if (this.frameTimes.length < 120) return;
		const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
		this.frameTimes.length = 0;
		if (avg > 1 / 45) {
			this.pixelRatio = 1;
			this.renderer.setPixelRatio(1);
			for (const m of this.glowMats) m.uniforms.uPixelRatio.value = 1;
			this.resize();
		}
	}
}
