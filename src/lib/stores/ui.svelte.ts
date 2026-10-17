import type { NetworkScene } from '$lib/three/NetworkScene';

/** Cross-component UI state. */
export const ui = $state({
	paletteOpen: false
});

/** The live 3D scene, when one is mounted (null on mobile / no-WebGL fallback). */
export const sceneRef: { current: NetworkScene | null } = { current: null };
