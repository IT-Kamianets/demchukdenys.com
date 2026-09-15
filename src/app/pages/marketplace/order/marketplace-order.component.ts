import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../seo.service';

@Component({
	selector: 'app-marketplace-order-confirmation',
	imports: [RouterLink],
	templateUrl: './marketplace-order-confirmation.component.html',
	styles: [],
})
export class MarketplaceOrderConfirmationPage implements OnInit {
	private readonly _seo = inject(SeoService);

	orderNumber = 'DEMO-0001';
	status = 'Прийнято в обробку';
	items = [
		{ title: 'Холодильник Nordic Steel 420', qty: 1, price: 32999 },
		{ title: 'Витяжка Airo Slim 60', qty: 1, price: 9899 },
		{ title: 'Змішувач Arc Steel', qty: 2, price: 3199 },
	];

	get total(): number {
		return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
	}

	ngOnInit(): void {
		this._seo.setPage({
			title: `Замовлення ${this.orderNumber}`,
			description: 'Підтвердження замовлення.',
			robots: 'noindex, nofollow',
		});
	}
}
