import { getAllPosts } from '$lib/blog/loadPosts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	recentBlogs: getAllPosts().slice(0, 3)
});
