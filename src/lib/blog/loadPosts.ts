import matter from 'gray-matter';
import { marked } from 'marked';

export type BlogPost = {
	slug: string;
	title: string;
	date: string;
	tags: string[];
	excerpt: string;
	coverColor?: string;
	/** Rendered HTML from Markdown body */
	content: string;
};

marked.setOptions({ gfm: true, breaks: true, async: false });

const rawModules = import.meta.glob<string>('../../content/blog/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

function fileSlug(path: string): string {
	const name = path.split('/').pop() ?? '';
	return name.replace(/\.md$/, '');
}

function parseAll(): BlogPost[] {
	const posts: BlogPost[] = [];

	for (const [path, raw] of Object.entries(rawModules)) {
		const { data, content } = matter(raw);
		const slug = (typeof data.slug === 'string' && data.slug) || fileSlug(path);
		const body = content.trim();
		const html = marked(body, { async: false });

		posts.push({
			slug,
			title: String(data.title ?? ''),
			date: String(data.date ?? ''),
			tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
			excerpt: String(data.excerpt ?? ''),
			coverColor: typeof data.coverColor === 'string' ? data.coverColor : undefined,
			content: html
		});
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

let cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
	if (!cache) cache = parseAll();
	return cache;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
	return getAllPosts().find((p) => p.slug === slug);
}
