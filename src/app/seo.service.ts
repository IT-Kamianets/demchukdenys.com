import { DOCUMENT } from '@angular/common';
import { inject, Service } from '@angular/core';
import { buildAbsoluteUrl } from '@wawjs/ngx-default';
import { MetaPage, MetaService } from '@wawjs/ngx-core';
import { companyProfile } from './feature/company/company.data';

@Service()
export class SeoService {
	private readonly _document = inject(DOCUMENT);
	private readonly _metaService = inject(MetaService);

	/** Sets meta for dynamic/id pages (portfolio & article detail) whose content isn't known at route-definition time. */
	setPage(page: MetaPage): void {
		this._metaService.applyMeta(page);
	}

	setBusinessSchema(): void {
		const { structuredData } = companyProfile;
		const schema = {
			'@context': 'https://schema.org',
			'@type': structuredData.type,
			name: companyProfile.name,
			url: companyProfile.siteUrl,
			image: buildAbsoluteUrl(companyProfile.siteUrl, companyProfile.image),
			telephone: companyProfile.phone,
			address: {
				'@type': 'PostalAddress',
				streetAddress: companyProfile.address,
				addressLocality: structuredData.addressLocality,
				addressCountry: structuredData.addressCountry,
			},
			sameAs: structuredData.sameAs,
			priceRange: structuredData.priceRange,
		};

		this._setJsonLd('business-schema', schema);
	}

	setWebSiteSchema(): void {
		this._setJsonLd('website-schema', {
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: companyProfile.name,
			url: companyProfile.siteUrl,
			inLanguage: companyProfile.locale,
		});
	}

	setArticleSchema({
		title,
		description,
		path,
		image,
		datePublished,
	}: {
		title: string;
		description: string;
		path: string;
		image: string;
		datePublished: string;
	}): void {
		this._setJsonLd('article-schema', {
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: title,
			description,
			image: buildAbsoluteUrl(companyProfile.siteUrl, image),
			datePublished,
			dateModified: datePublished,
			mainEntityOfPage: buildAbsoluteUrl(companyProfile.siteUrl, path),
			author: { '@type': 'Organization', name: companyProfile.name },
			publisher: { '@type': 'Organization', name: companyProfile.name },
		});
	}

	setBreadcrumbs(items: Array<{ name: string; path: string }>): void {
		this._setJsonLd('breadcrumbs-schema', {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: items.map((item, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: item.name,
				item: buildAbsoluteUrl(companyProfile.siteUrl, item.path),
			})),
		});
	}

	private _setJsonLd(id: string, value: object): void {
		let script = this._document.head.querySelector<HTMLScriptElement>(`#${id}`);

		if (!script) {
			script = this._document.createElement('script');
			script.id = id;
			script.type = 'application/ld+json';
			this._document.head.appendChild(script);
		}

		script.textContent = JSON.stringify(value);
	}
}
