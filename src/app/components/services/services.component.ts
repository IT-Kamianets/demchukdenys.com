import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';
import { ScrollAnimateChildrenDirective } from '../../directives/scroll-animate-children.directive';

@Component({
	selector: 'app-services',
	imports: [RouterLink, ScrollAnimateDirective, ScrollAnimateChildrenDirective],
	templateUrl: './services.component.html',
	styles: [],
})
export class ServicesComponent {
	services = [
		{
			title: 'Кухні на замовлення',
			description:
				'Проєктуємо та виготовляємо кухні будь-якої складності - від мінімалістичних до класичних',
			image: 'img/services/k4.webp',
		},
		{
			title: 'Корпусні меблі',
			description: 'Комоди, тумби та інші меблі на замовлення з індивідуальним дизайном',
			image: 'img/services/m4.webp',
		},
		{
			title: 'Гардеробні системи',
			description: 'Вбудовані гардеробні та шафи з продуманою організацією простору',
			image: 'img/services/p4.webp',
		},
	];
}
