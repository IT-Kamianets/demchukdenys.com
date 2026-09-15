import { Routes } from '@angular/router';
import { MetaGuard } from '@wawjs/ngx-core';
import { buildRouteMeta } from '@wawjs/ngx-default';
import { companyProfile } from './feature/company/company.data';

export const routes: Routes = [
	{
		path: '',
		canActivate: [MetaGuard],
		data: { meta: { ...buildRouteMeta(companyProfile, '/'), titleSuffix: '' } },
		loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
	},
	{
		path: 'portfolios',
		canActivate: [MetaGuard],
		data: { meta: buildRouteMeta(companyProfile, '/portfolios') },
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
		canActivate: [MetaGuard],
		data: { meta: buildRouteMeta(companyProfile, '/services') },
		loadComponent: () =>
			import('./pages/services/services.component').then((m) => m.ServicesPage),
	},
	{
		path: 'articles',
		canActivate: [MetaGuard],
		data: { meta: buildRouteMeta(companyProfile, '/articles') },
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
	{
		path: '3d-models',
		canActivate: [MetaGuard],
		data: { meta: buildRouteMeta(companyProfile, '/3d-models') },
		loadComponent: () =>
			import('./pages/models-3d/models-3d.component').then((m) => m.Models3dPage),
	},
	{
		path: 'kitchen-calculator',
		canActivate: [MetaGuard],
		data: { meta: buildRouteMeta(companyProfile, '/kitchen-calculator') },
		loadComponent: () =>
			import('./pages/kitchen-calculator/kitchen-calculator.component').then(
				(m) => m.KitchenCalculatorPage,
			),
	},
	// Marketplace (staged feature — intentionally not linked from any nav, sitemap, or robots.txt; noindex).
	{
		path: 'catalog',
		canActivate: [MetaGuard],
		data: { meta: buildRouteMeta(companyProfile, '/catalog') },
		loadComponent: () =>
			import('./pages/marketplace/catalog/marketplace-catalog.component').then(
				(m) => m.MarketplaceCatalogPage,
			),
	},
	{
		path: 'product/:id',
		loadComponent: () =>
			import('./pages/marketplace/product-detail/marketplace-product-detail.component').then(
				(m) => m.MarketplaceProductDetailPage,
			),
	},
	{
		path: 'cart',
		canActivate: [MetaGuard],
		data: { meta: buildRouteMeta(companyProfile, '/cart') },
		loadComponent: () =>
			import('./pages/marketplace/cart/marketplace-cart.component').then(
				(m) => m.MarketplaceCartPage,
			),
	},
	{
		path: 'checkout',
		canActivate: [MetaGuard],
		data: { meta: buildRouteMeta(companyProfile, '/checkout') },
		loadComponent: () =>
			import('./pages/marketplace/checkout/marketplace-checkout.component').then(
				(m) => m.MarketplaceCheckoutPage,
			),
	},
	{
		path: 'order/:id',
		loadComponent: () =>
			import(
				'./pages/marketplace/order-confirmation/marketplace-order-confirmation.component'
			).then((m) => m.MarketplaceOrderConfirmationPage),
	},
	{
		path: 'account',
		canActivate: [MetaGuard],
		data: { meta: buildRouteMeta(companyProfile, '/account') },
		loadComponent: () =>
			import('./pages/marketplace/account/marketplace-account.component').then(
				(m) => m.MarketplaceAccountPage,
			),
	},
	{
		path: 'admin',
		canActivate: [MetaGuard],
		data: { meta: buildRouteMeta(companyProfile, '/admin') },
		loadComponent: () =>
			import('./pages/marketplace/admin/marketplace-admin.component').then(
				(m) => m.MarketplaceAdminPage,
			),
	},
	{
		path: '**',
		canActivate: [MetaGuard],
		data: {
			meta: {
				title: 'Сторінку не знайдено',
				description: 'Сторінку, яку ви шукаєте, не знайдено.',
				index: false,
			},
		},
		loadComponent: () =>
			import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
	},
];
