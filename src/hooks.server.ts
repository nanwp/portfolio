import type { Handle } from '@sveltejs/kit';

/**
 * Paths browsers or extensions request against the app origin by mistake.
 * (e.g. React DevTools looking for installHook.js.map — not part of this site.)
 */
const SILENT_204 = new Set(['/installHook.js.map', '/installHook.js']);

export const handle: Handle = async ({ event, resolve }) => {
	if (SILENT_204.has(event.url.pathname)) {
		return new Response(null, { status: 204 });
	}
	return resolve(event);
};
