import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LightboxComponent } from '../../components/lightbox/lightbox.component';
import { SeoService } from '../../seo.service';

@Component({
	selector: 'app-portfolio-detail',
	imports: [RouterLink, LightboxComponent],
	templateUrl: './portfolio-detail.component.html',
	styles: [],
})
export class PortfolioDetailPage implements OnInit {
	item: any = null;
	lightboxOpen = false;

	private portfolioItems = [
		{
			id: 1,
			title: 'Кухня «Біла класика»',
			description:
				"П-подібна кухня з білими фасадами, дерев'яною стільницею та темною плиткою на фартуху.",
			fullDescription:
				"П-подібна кухня у білому кольорі, виготовлена під індивідуальні розміри приміщення. Фасади - матовий МДФ із фрезеруванням, стільниця з натурального дерева підкреслює теплоту інтер'єру. Фартух оздоблено темною плиткою, що створює стильний контраст. Кухня обладнана підвісними світильниками над робочою зоною. Фурнітура Blum з плавним закриванням забезпечує комфортне користування щодня. Проєкт включав замір, 3D-візуалізацію, виготовлення та монтаж.",
			image: 'img/slider/k1.webp',
		},
		{
			id: 2,
			title: 'Кухня з барною стійкою',
			description:
				'Сучасна кухня у сірих тонах з барною зоною та оксамитовими стільцями синього кольору.',
			fullDescription:
				"Сучасна кухня у поєднанні сірих та білих тонів з акцентною барною стійкою. Фасади виконані з МДФ у матовому сірому покритті, стільниця - сірий кварцовий агломерат. Барна зона з'єднує кухню із житловим простором та доповнена м'якими стільцями з синього оксамиту. Вбудована техніка гармонійно інтегрована у загальний дизайн. Функціональне планування дозволяє комфортно готувати та приймати гостей одночасно.",
			image: 'img/slider/k3.webp',
		},
		{
			id: 3,
			title: 'Спальний гарнітур',
			description:
				"Ліжко з м'яким темним узголів'ям, каркас зі світлого дерева та висувними ящиками, приліжкова тумба.",
			fullDescription:
				"Спальний гарнітур, виготовлений на замовлення. Ліжко з м'яким узголів'ям, оббитим темною тканиною, та каркасом зі світлого дерева з вбудованими висувними ящиками для зберігання білизни. Приліжкова тумба виконана у тому ж стилі - поєднання світлого дерева та темних елементів. Гарнітур розроблений з акцентом на ергономіку та максимальне використання простору. Матеріали підібрані для довговічності та комфорту.",
			image: 'img/slider/m1.webp',
		},
		{
			id: 4,
			title: 'Кухня «Мінімалізм»',
			description:
				'Пряма кухня у бежевих тонах з вбудованою духовою шафою, мікрохвильовкою та газовою варильною поверхнею.',
			fullDescription:
				'Пряма кухня у стилі мінімалізм з фасадами у ніжному бежевому відтінку. Чисті лінії без видимих ручок - система push-to-open забезпечує лаконічний вигляд. Вбудована колонка з духовою шафою та мікрохвильовою піччю розташована зліва. Газова варильна поверхня вмонтована у стільницю, що відповідає загальній колірній гамі. Верхні шафи до стелі максимізують простір для зберігання. Ідеальне рішення для компактних кухонь.',
			image: 'img/services/k4.webp',
		},
		{
			id: 5,
			title: 'Комод на металевому каркасі',
			description:
				'Сучасний комод з темно-сірими фасадами та білою стільницею на чорному металевому каркасі.',
			fullDescription:
				'Сучасний комод у стилі лофт, виготовлений на замовлення для спальні. Корпус з темно-сірими матовими фасадами встановлений на чорний металевий каркас, що надає виробу легкості та сучасного вигляду. Біла стільниця створює елегантний контраст. Чотири просторі ящики з прихованими напрямними забезпечують плавне та безшумне відкривання. Мінімалістичні чорні ручки доповнюють загальний стиль.',
			image: 'img/services/m4.webp',
		},
		{
			id: 6,
			title: 'Гардеробна система',
			description:
				'Вбудована гардеробна з білими глянцевими фасадами, дзеркальною секцією та робочим столом.',
			fullDescription:
				'Вбудована гардеробна система від стіни до стіни з білими глянцевими фасадами та чорними акцентними елементами. Ліва частина включає дзеркальну секцію та вбудований робочий стіл - ідеальне рішення для поєднання зони зберігання та робочого місця. Правий блок - повноцінна шафа з розпашними дверцятами для одягу та аксесуарів. Фурнітура Hettich забезпечує довговічність та надійність.',
			image: 'img/services/p4.webp',
		},
	];

	constructor(
		private route: ActivatedRoute,
		private title: Title,
		private meta: Meta,
		private seo: SeoService,
	) {}

	ngOnInit() {
		const id = Number(this.route.snapshot.paramMap.get('id'));
		this.item = this.portfolioItems.find((p) => p.id === id) || this.portfolioItems[0];
		this.title.setTitle(`${this.item.title} - Demchuk Denys`);
		this.meta.updateTag({
			name: 'description',
			content: this.item.fullDescription.substring(0, 160),
		});
		this.meta.updateTag({ property: 'og:title', content: this.item.title });
		this.meta.updateTag({
			property: 'og:description',
			content: this.item.fullDescription.substring(0, 160),
		});
		this.seo.setPage({
			title: `${this.item.title} | Demchuk Denys`,
			description: this.item.fullDescription.substring(0, 160),
			path: `portfolio/${this.item.id}`,
			image: `/${this.item.image}`,
		});
		this.seo.setBreadcrumbs([
			{ name: 'Головна', path: '' },
			{ name: 'Портфоліо', path: 'portfolios' },
			{ name: this.item.title, path: `portfolio/${this.item.id}` },
		]);
	}
}
