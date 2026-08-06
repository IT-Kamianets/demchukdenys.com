import { Component } from '@angular/core';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';
import { ScrollAnimateChildrenDirective } from '../../directives/scroll-animate-children.directive';

@Component({
	selector: 'app-advantages',
	imports: [ScrollAnimateDirective, ScrollAnimateChildrenDirective],
	templateUrl: './advantages.component.html',
	styles: [],
})
export class AdvantagesComponent {
	advantages = [
		{
			title: 'Безкоштовний замір',
			description:
				'Наш спеціаліст безкоштовно виїде до вас та зробить точні заміри приміщення',
			icon: 'img/advantages/1.svg',
		},
		{
			title: 'Створення дизайну',
			description: 'Розробляємо унікальний дизайн-проєкт з урахуванням всіх ваших побажань',
			icon: 'img/advantages/2.svg',
		},
		{
			title: 'Виробництво',
			description: 'Виготовлення меблів будь-якої складності з якісних матеріалів',
			icon: 'img/advantages/3.svg',
		},
		{
			title: 'Доставка та монтаж',
			description: 'Професійна доставка та встановлення меблів у зручний для вас час',
			icon: 'img/advantages/4.svg',
		},
	];
}
