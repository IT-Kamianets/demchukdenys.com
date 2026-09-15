import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';

@Component({
	selector: 'app-not-found',
	imports: [RouterLink, TranslateDirective],
	template: `
		<main class="min-h-screen bg-warm-white dark:bg-dark flex items-center justify-center px-4">
			<section class="max-w-lg text-center">
				<p class="text-beige-dark font-semibold tracking-widest">404</p>
				<h1 class="mt-3 text-3xl font-bold text-dark dark:text-white" translate="Сторінку не знайдено"></h1>
				<p class="mt-4 text-gray-600 dark:text-gray-300" translate="Можливо, посилання застаріло або містить помилку."></p>
				<a routerLink="/" class="mt-8 inline-flex rounded-xl bg-dark px-6 py-3 font-semibold text-white dark:bg-beige dark:text-dark" translate="На головну"></a>
			</section>
		</main>
	`,
})
export class NotFoundComponent {}
