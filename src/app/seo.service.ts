import { DOCUMENT } from '@angular/common';
import { inject, Service } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_URL = 'https://demchukdenys.com';
const DEFAULT_IMAGE = '/img/slider/k1.webp';

type PageSeo = {
	title: string;
	description: string;
	path?: string;
	image?: string;
	type?: 'article' | 'website';
};

@Service()
export class SeoService {
	private readonly _document = inject(DOCUMENT);
	private readonly _meta = inject(Meta);
	private readonly _title = inject(Title);

	setPage(page: PageSeo): void {
		queueMicrotask(() => this._applyPage(page));
	}

	private _applyPage({
		title,
		description,
		path = '',
		image = DEFAULT_IMAGE,
		type = 'website',
	}: PageSeo): void {
		const url = new URL(path, `${SITE_URL}/`).href;
		const imageUrl = new URL(image, `${SITE_URL}/`).href;

		this._title.setTitle(title);
		this._meta.updateTag({ name: 'description', content: description });
		this._meta.updateTag({ property: 'og:title', content: title });
		this._meta.updateTag({ property: 'og:description', content: description });
		this._meta.updateTag({ property: 'og:url', content: url });
		this._meta.updateTag({ property: 'og:image', content: imageUrl });
		this._meta.updateTag({ property: 'og:type', content: type });
		this._meta.updateTag({ property: 'og:locale', content: 'uk_UA' });
		this._meta.updateTag({ property: 'og:site_name', content: 'Demchuk Denys' });
		this._meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
		this._meta.updateTag({ name: 'twitter:title', content: title });
		this._meta.updateTag({ name: 'twitter:description', content: description });
		this._meta.updateTag({ name: 'twitter:image', content: imageUrl });

		let canonical = this._document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

		if (!canonical) {
			canonical = this._document.createElement('link');
			canonical.rel = 'canonical';
			this._document.head.appendChild(canonical);
		}

		canonical.href = url;
	}

	setBusinessSchema(): void {
		const schema = {
			'@context': 'https://schema.org',
			'@type': 'FurnitureStore',
			name: 'Demchuk Denys',
			url: SITE_URL,
			image: new URL(DEFAULT_IMAGE, `${SITE_URL}/`).href,
			telephone: '+380680278101',
			address: {
				'@type': 'PostalAddress',
				streetAddress: 'вул. Івана Мазепи, 51',
				addressLocality: 'Камʼянець-Подільський',
				addressRegion: 'Хмельницька область',
				postalCode: '32306',
				addressCountry: 'UA',
			},
			geo: {
				'@type': 'GeoCoordinates',
				latitude: 48.68475,
				longitude: 26.5977,
			},
			makesOffer: [
				'Кухні на замовлення',
				'Корпусні меблі на замовлення',
				'Гардеробні системи',
			].map((name) => ({
				'@type': 'Offer',
				itemOffered: {
					'@type': 'Service',
					name,
				},
			})),
			sameAs: [
				'https://www.facebook.com/denys.demchuk.2025',
				'https://instagram.com/demchuk_denys',
				'https://t.me/Demchukdv',
			],
			priceRange: '$$',
		};
		let script = this._document.head.querySelector<HTMLScriptElement>('#business-schema');

		if (!script) {
			script = this._document.createElement('script');
			script.id = 'business-schema';
			script.type = 'application/ld+json';
			this._document.head.appendChild(script);
		}

		script.textContent = JSON.stringify(schema);
	}
}
