import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AdvantagesComponent } from '../../components/advantages/advantages.component';
import { ArticlesComponent } from '../../components/articles/articles.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { CtaBannerComponent } from '../../components/cta-banner/cta-banner.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { PortfolioComponent } from '../../components/portfolio/portfolio.component';
import { ServicesComponent } from '../../components/services/services.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { SeoService } from '../../seo.service';

@Component({
	selector: 'app-home',
	imports: [
		HeroComponent,
		PortfolioComponent,
		ServicesComponent,
		ArticlesComponent,
		AdvantagesComponent,
		TestimonialsComponent,
		ContactFormComponent,
		CtaBannerComponent,
	],
	templateUrl: './home.component.html',
	styles: [],
})
export class HomeComponent implements OnInit {
	constructor(
		private title: Title,
		private meta: Meta,
		private seo: SeoService,
	) {}

	ngOnInit() {
		this.seo.setPage({
			title: 'Меблі на замовлення в Камʼянці-Подільському | Demchuk Denys',
			description:
				'Кухні, корпусні меблі та гардеробні системи на замовлення в Камʼянці-Подільському. Індивідуальний дизайн, замір і монтаж.',
		});
		this.seo.setBusinessSchema();
		this.seo.setWebSiteSchema();
		this.title.setTitle('Demchuk Denys - Кухні та меблі люкс якості');
		this.meta.updateTag({
			name: 'description',
			content:
				"Створюємо унікальні меблі преміум-класу. Дизайн інтер'єру, кухні та меблі на замовлення у Кам'янці-Подільському.",
		});
		this.meta.updateTag({
			property: 'og:title',
			content: 'Demchuk Denys - Кухні та меблі люкс якості',
		});
		this.meta.updateTag({
			property: 'og:description',
			content:
				'Створюємо унікальні меблі преміум-класу, які перетворюють ваш простір на витвір мистецтва.',
		});
	}
}
