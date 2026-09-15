import { Component, OnInit } from '@angular/core';
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
	constructor(private seo: SeoService) {}

	ngOnInit() {
		this.seo.setBusinessSchema();
		this.seo.setWebSiteSchema();
	}
}
