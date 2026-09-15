import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

type MockCartItem = {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	price: number;
	qty: number;
};

@Component({
	selector: 'app-marketplace-cart',
	imports: [RouterLink],
	templateUrl: './marketplace-cart.component.html',
	styles: [],
})
export class MarketplaceCartPage {
	phoneDisplay = environment.phoneDisplay;
	phoneHref = environment.phoneHref;

	items = signal<MockCartItem[]>([
		{
			id: 'fridge-nordic-1',
			title: 'Холодильник Nordic Steel 420',
			subtitle: 'Двокамерний · No Frost',
			image: 'img/product/1.webp',
			price: 32999,
			qty: 1,
		},
		{
			id: 'hood-slim-1',
			title: 'Витяжка Airo Slim 60',
			subtitle: 'Похила · 60 см',
			image: 'img/services/m4.webp',
			price: 9899,
			qty: 1,
		},
		{
			id: 'faucet-arc-1',
			title: 'Змішувач Arc Steel',
			subtitle: 'Нержавіюча сталь',
			image: 'img/article/k.webp',
			price: 3199,
			qty: 2,
		},
	]);

	get total(): number {
		return this.items().reduce((sum, item) => sum + item.price * item.qty, 0);
	}

	changeQty(id: string, delta: number): void {
		this.items.update((list) =>
			list.map((item) =>
				item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
			),
		);
	}

	remove(id: string): void {
		this.items.update((list) => list.filter((item) => item.id !== id));
	}
}
