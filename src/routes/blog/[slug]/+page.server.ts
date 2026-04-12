import { error } from '@sveltejs/kit';
import { getAllPosts, getPostBySlug } from '$lib/blog/loadPosts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const blog = getPostBySlug(params.slug);

	if (!blog) {
		throw error(404, 'Blog post not found');
	}

	const related = getAllPosts()
		.filter((b) => b.slug !== blog.slug && b.tags.some((t) => blog.tags.includes(t)))
		.slice(0, 2);

	return { blog, related };
};
