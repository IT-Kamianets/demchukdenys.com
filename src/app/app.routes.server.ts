import { RenderMode, ServerRoute } from '@angular/ssr';
import { staticProducts } from './feature/marketplace/products.data';

const PORTFOLIO_IDS = [1, 2, 3, 4, 5, 6];
const ARTICLE_IDS = [1, 2, 3, 4, 5, 6];

export const serverRoutes: ServerRoute[] = [
	{
		path: 'portfolio/:id',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => PORTFOLIO_IDS.map((id) => ({ id: String(id) })),
	},
	{
		path: 'article/:id',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => ARTICLE_IDS.map((id) => ({ id: String(id) })),
	},
	{
		path: 'product/:id',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => staticProducts.map((product) => ({ id: product.id })),
	},
	{
		// Order ids are generated at runtime by the (static, non-persisted) checkout flow — nothing to prerender.
		path: 'order/:id',
		renderMode: RenderMode.Client,
	},
	{
		// Auth state only exists in the browser (Firebase Auth). Prerendering/SSR would run the
		// admin auth check with no user, baking a permanent "redirect to /login" into the static
		// output — these must render purely client-side so the real, live session is checked.
		path: 'admin',
		renderMode: RenderMode.Client,
	},
	{
		path: 'login',
		renderMode: RenderMode.Client,
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
