import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-services-page',
	imports: [RouterLink],
	templateUrl: './services.html',
	styles: [],
})
export class ServicesPage implements OnInit {
	constructor(
		private title: Title,
		private meta: Meta,
	) {}

	ngOnInit() {
		this.title.setTitle('Послуги - Demchuk Denys');
		this.meta.updateTag({
			name: 'description',
			content:
				'Кухні на замовлення, корпусні меблі та гардеробні системи від Demchuk Denys. Повний цикл від заміру до монтажу.',
		});
		this.meta.updateTag({ property: 'og:title', content: 'Послуги - Demchuk Denys' });
		this.meta.updateTag({
			property: 'og:description',
			content: 'Кухні на замовлення, корпусні меблі та гардеробні системи від Demchuk Denys.',
		});
	}

	services = [
		{
			title: 'Кухні на замовлення',
			description:
				'Проєктуємо та виготовляємо кухні будь-якої складності - від компактних прямих до просторих П-подібних з барною стійкою. Повний цикл: від заміру до монтажу.',
			includes: [
				'Безкоштовний замір та консультація',
				'3D-візуалізація майбутньої кухні',
				'Виготовлення з якісних матеріалів',
				'Доставка та професійний монтаж',
			],
			image: 'img/services/k4.webp',
		},
		{
			title: 'Корпусні меблі',
			description:
				"Комоди, тумби, стелажі та інші корпусні меблі на замовлення. Індивідуальний дизайн під ваш інтер'єр з використанням якісних матеріалів та фурнітури.",
			includes: [
				'Індивідуальне проєктування під розміри',
				'Вибір матеріалів та кольорів',
				'Фурнітура Blum / Hettich',
				'Гарантійне обслуговування',
			],
			image: 'img/services/m4.webp',
		},
		{
			title: 'Гардеробні системи',
			description:
				'Вбудовані шафи та гардеробні від стіни до стіни з продуманою організацією внутрішнього простору. Максимальне використання кожного сантиметра.',
			includes: [
				'Замір та проєктування наповнення',
				'Дзеркальні та глянцеві фасади',
				'Вбудоване LED-освітлення',
				'Інтеграція з робочою зоною',
			],
			image: 'img/services/p4.webp',
		},
	];
}
