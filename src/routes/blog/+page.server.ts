import { getAllPosts } from '$lib/blog/loadPosts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	posts: getAllPosts()
});
