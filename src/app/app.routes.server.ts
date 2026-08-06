import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{ path: '', renderMode: RenderMode.Prerender },
	{ path: 'portfolios', renderMode: RenderMode.Prerender },
	{
		path: 'portfolio/:id',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return [1, 2, 3, 4, 5, 6].map((id) => ({ id: String(id) }));
		},
	},
	{ path: 'services', renderMode: RenderMode.Prerender },
	{ path: 'articles', renderMode: RenderMode.Prerender },
	{
		path: 'article/:id',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return [1, 2, 3, 4, 5, 6].map((id) => ({ id: String(id) }));
		},
	},
	{ path: '**', renderMode: RenderMode.Client },
];
