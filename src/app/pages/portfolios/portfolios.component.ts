import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../seo.service';

@Component({
	selector: 'app-portfolios',
	imports: [RouterLink],
	templateUrl: './portfolios.component.html',
	styles: [],
})
export class PortfoliosPage implements OnInit {
	constructor(
		private title: Title,
		private meta: Meta,
		private seo: SeoService,
	) {}

	ngOnInit() {
		this.seo.setPage({
			title: 'Портфоліо меблів на замовлення | Demchuk Denys',
			description:
				'Портфоліо кухонь, спалень, корпусних меблів і гардеробних систем, виготовлених Demchuk Denys у Камʼянці-Подільському.',
			path: 'portfolios',
			image: '/img/slider/k1.webp',
		});
		this.title.setTitle('Портфоліо - Demchuk Denys');
		this.meta.updateTag({
			name: 'description',
			content:
				'Наші кращі роботи: кухні, спальні, вітальні та гардеробні кімнати преміум-класу.',
		});
		this.meta.updateTag({ property: 'og:title', content: 'Портфоліо - Demchuk Denys' });
		this.meta.updateTag({
			property: 'og:description',
			content:
				'Наші кращі роботи: кухні, спальні, вітальні та гардеробні кімнати преміум-класу.',
		});
	}

	portfolioItems = [
		{
			id: 1,
			title: 'Кухня «Біла класика»',
			description:
				"П-подібна кухня з білими фасадами, дерев'яною стільницею та темною плиткою на фартуху.",
			image: 'img/slider/k1.webp',
		},
		{
			id: 2,
			title: 'Кухня з барною стійкою',
			description:
				'Сучасна кухня у сірих тонах з барною зоною та оксамитовими стільцями синього кольору.',
			image: 'img/slider/k3.webp',
		},
		{
			id: 3,
			title: 'Спальний гарнітур',
			description:
				"Ліжко з м'яким темним узголів'ям, каркас зі світлого дерева та висувними ящиками, приліжкова тумба.",
			image: 'img/slider/m1.webp',
		},
		{
			id: 4,
			title: 'Кухня «Мінімалізм»',
			description:
				'Пряма кухня у бежевих тонах з вбудованою духовою шафою, мікрохвильовкою та газовою варильною поверхнею.',
			image: 'img/services/k4.webp',
		},
		{
			id: 5,
			title: 'Комод на металевому каркасі',
			description:
				'Сучасний комод з темно-сірими фасадами та білою стільницею на чорному металевому каркасі.',
			image: 'img/services/m4.webp',
		},
		{
			id: 6,
			title: 'Гардеробна система',
			description:
				'Вбудована гардеробна з білими глянцевими фасадами, дзеркальною секцією та робочим столом.',
			image: 'img/services/p4.webp',
		},
	];
}
