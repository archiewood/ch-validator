import { createHighlighter } from 'shiki';

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

export async function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ['github-dark'],
			langs: ['sql'],
		});
	}
	return highlighterPromise;
}

export function highlightSql(code: string, highlighter: Awaited<ReturnType<typeof createHighlighter>>): string {
	return highlighter.codeToHtml(code || ' ', {
		lang: 'sql',
		theme: 'github-dark',
	});
}
