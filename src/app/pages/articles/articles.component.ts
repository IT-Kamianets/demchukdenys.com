import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../seo.service';

@Component({
	selector: 'app-articles-page',
	imports: [RouterLink],
	templateUrl: './articles.component.html',
	styles: [],
})
export class ArticlesPage implements OnInit {
	constructor(
		private title: Title,
		private meta: Meta,
		private seo: SeoService,
	) {}

	ngOnInit() {
		this.seo.setPage({
			title: 'Статті про меблі та дизайн інтерʼєру | Demchuk Denys',
			description:
				'Корисні статті про планування кухні, меблі на замовлення, організацію простору та дизайн інтерʼєру.',
			path: 'articles',
			image: '/img/article/k.webp',
		});
		this.title.setTitle('Статті та новини - Demchuk Denys');
		this.meta.updateTag({
			name: 'description',
			content:
				"Корисні статті про дизайн інтер'єру, тренди у меблях та поради від професіоналів.",
		});
		this.meta.updateTag({ property: 'og:title', content: 'Статті та новини - Demchuk Denys' });
		this.meta.updateTag({
			property: 'og:description',
			content:
				"Корисні статті про дизайн інтер'єру, тренди у меблях та поради від професіоналів.",
		});
	}

	articles = [
		{
			id: 1,
			title: 'Робоче місце вдома: як облаштувати домашній кабінет',
			excerpt: 'Поради щодо створення зручного та стильного робочого простору у вашій оселі.',
			date: '15 Січня 2024',
			image: 'img/article/s1.webp',
		},
		{
			id: 2,
			title: 'Як обрати ідеальну кухню: поради від виробника',
			excerpt:
				'Розбираємо ключові моменти при замовленні кухні - від планування до вибору матеріалів.',
			date: '10 Січня 2024',
			image: 'img/article/k.webp',
		},
		{
			id: 3,
			title: 'Вбудовані меблі: максимум простору у кожній кімнаті',
			excerpt:
				'Як вбудовані шафи та системи зберігання допомагають ефективно використати кожен метр.',
			date: '05 Січня 2024',
			image: 'img/article/l1.webp',
		},
		{
			id: 4,
			title: 'Меблі у стилі лофт: поєднання дерева та металу',
			excerpt:
				"Як створити сучасний інтер'єр з характером за допомогою індустріальних акцентів.",
			date: '28 Грудня 2023',
			image: 'img/article/s1.webp',
		},
		{
			id: 5,
			title: 'Кухня з барною стійкою: за і проти',
			excerpt: 'Чи варто обирати кухню з барною зоною та як її правильно спланувати.',
			date: '20 Грудня 2023',
			image: 'img/article/k.webp',
		},
		{
			id: 6,
			title: 'Організація зберігання: рішення для кожної кімнати',
			excerpt:
				'Практичні ідеї вбудованих систем зберігання для спальні, дитячої та вітальні.',
			date: '15 Грудня 2023',
			image: 'img/article/l1.webp',
		},
	];
}
