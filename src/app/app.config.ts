import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
	buildAbsoluteUrl,
	buildSeoTitleSuffix,
	provideNgxDefaultSeo,
	stripTitleSuffix,
} from '@wawjs/ngx-default';
import { provideNgxCore } from '@wawjs/ngx-core';
import { provideTranslate } from '@wawjs/ngx-translate';

import { routes } from './app.routes';
import { companyProfile } from './feature/company/company.data';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideHttpClient(),
		provideNgxCore({
			meta: {
				applyFromRoutes: true,
				useTitleSuffix: true,
				defaults: {
					title: stripTitleSuffix(companyProfile.defaultSeo.title, companyProfile.name),
					titleSuffix: buildSeoTitleSuffix(companyProfile),
					description: companyProfile.defaultSeo.description,
					image: buildAbsoluteUrl(companyProfile.siteUrl, companyProfile.defaultSeo.image),
					robots: companyProfile.defaultSeo.robots,
				},
			},
		}),
		provideNgxDefaultSeo({
			siteUrl: companyProfile.siteUrl,
		}),
		provideTranslate({
			defaultLanguage: environment.defaultLanguage,
			languages: environment.languages,
			folder: '/i18n/',
		}),
		provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
		provideClientHydration(withEventReplay()),
	],
};
