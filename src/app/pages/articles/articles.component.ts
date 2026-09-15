import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';

@Component({
	selector: 'app-articles-page',
	imports: [RouterLink, TranslateDirective],
	templateUrl: './articles.component.html',
	styles: [],
})
export class ArticlesPage {
	articles = [
		{
			id: 1,
			title: 'Робоче місце вдома: як облаштувати домашній кабінет',
			excerpt: 'Поради щодо створення зручного та стильного робочого простору у вашій оселі.',
			date: '29 Липня 2026',
			image: 'img/article/s1.webp',
		},
		{
			id: 2,
			title: 'Як обрати ідеальну кухню: поради від виробника',
			excerpt:
				'Розбираємо ключові моменти при замовленні кухні - від планування до вибору матеріалів.',
			date: '18 Липня 2026',
			image: 'img/article/k.webp',
		},
		{
			id: 3,
			title: 'Вбудовані меблі: максимум простору у кожній кімнаті',
			excerpt:
				'Як вбудовані шафи та системи зберігання допомагають ефективно використати кожен метр.',
			date: '04 Липня 2026',
			image: 'img/article/l1.webp',
		},
		{
			id: 4,
			title: 'Меблі у стилі лофт: поєднання дерева та металу',
			excerpt:
				"Як створити сучасний інтер'єр з характером за допомогою індустріальних акцентів.",
			date: '26 Червня 2026',
			image: 'img/article/s1.webp',
		},
		{
			id: 5,
			title: 'Кухня з барною стійкою: за і проти',
			excerpt: 'Чи варто обирати кухню з барною зоною та як її правильно спланувати.',
			date: '14 Червня 2026',
			image: 'img/article/k.webp',
		},
		{
			id: 6,
			title: 'Організація зберігання: рішення для кожної кімнати',
			excerpt:
				'Практичні ідеї вбудованих систем зберігання для спальні, дитячої та вітальні.',
			date: '03 Червня 2026',
			image: 'img/article/l1.webp',
		},
	];
}
