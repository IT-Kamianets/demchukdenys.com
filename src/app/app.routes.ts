import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
	},
	{
		path: 'portfolios',
		loadComponent: () => import('./pages/portfolios/portfolios').then((m) => m.PortfoliosPage),
	},
	{
		path: 'portfolio/:id',
		loadComponent: () =>
			import('./pages/portfolio-detail/portfolio-detail').then((m) => m.PortfolioDetailPage),
	},
	{
		path: 'services',
		loadComponent: () => import('./pages/services/services').then((m) => m.ServicesPage),
	},
	{
		path: 'articles',
		loadComponent: () => import('./pages/articles/articles').then((m) => m.ArticlesPage),
	},
	{
		path: 'article/:id',
		loadComponent: () =>
			import('./pages/article-detail/article-detail').then((m) => m.ArticleDetailPage),
	},
];
