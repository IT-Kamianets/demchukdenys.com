import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../seo.service';

@Component({
	selector: 'app-not-found',
	imports: [RouterLink],
	template: `
		<main class="min-h-screen bg-warm-white dark:bg-dark flex items-center justify-center px-4">
			<section class="max-w-lg text-center">
				<p class="text-beige-dark font-semibold tracking-widest">404</p>
				<h1 class="mt-3 text-3xl font-bold text-dark dark:text-white">Сторінку не знайдено</h1>
				<p class="mt-4 text-gray-600 dark:text-gray-300">Можливо, посилання застаріло або містить помилку.</p>
				<a routerLink="/" class="mt-8 inline-flex rounded-xl bg-dark px-6 py-3 font-semibold text-white dark:bg-beige dark:text-dark">На головну</a>
			</section>
		</main>
	`,
})
export class NotFoundComponent implements OnInit {
	private readonly _seo = inject(SeoService);

	ngOnInit(): void {
		this._seo.setPage({
			title: 'Сторінку не знайдено | Demchuk Denys',
			description: 'Сторінку, яку ви шукаєте, не знайдено.',
			path: '404',
		});
		this._seo.setNoIndex();
	}
}
