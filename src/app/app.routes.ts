import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
	},
	{
		path: 'portfolios',
		loadComponent: () =>
			import('./pages/portfolios/portfolios.component').then((m) => m.PortfoliosPage),
	},
	{
		path: 'portfolio/:id',
		loadComponent: () =>
			import('./pages/portfolio-detail/portfolio-detail.component').then(
				(m) => m.PortfolioDetailPage,
			),
	},
	{
		path: 'services',
		loadComponent: () =>
			import('./pages/services/services.component').then((m) => m.ServicesPage),
	},
	{
		path: 'articles',
		loadComponent: () =>
			import('./pages/articles/articles.component').then((m) => m.ArticlesPage),
	},
	{
		path: 'article/:id',
		loadComponent: () =>
			import('./pages/article-detail/article-detail.component').then(
				(m) => m.ArticleDetailPage,
			),
	},
];
