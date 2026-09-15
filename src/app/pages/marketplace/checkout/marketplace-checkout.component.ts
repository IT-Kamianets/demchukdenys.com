import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

type MockCartItem = {
	title: string;
	price: number;
	qty: number;
};

@Component({
	selector: 'app-marketplace-checkout',
	imports: [FormsModule, RouterLink],
	templateUrl: './marketplace-checkout.component.html',
	styles: [],
})
export class MarketplaceCheckoutPage {
	name = '';
	phone = '';
	city = '';
	address = '';
	comment = '';
	paymentMethod: 'cash' | 'transfer' | 'card' = 'cash';

	phoneDisplay = environment.phoneDisplay;
	phoneHref = environment.phoneHref;

	items: MockCartItem[] = [
		{ title: 'Холодильник Nordic Steel 420', price: 32999, qty: 1 },
		{ title: 'Витяжка Airo Slim 60', price: 9899, qty: 1 },
		{ title: 'Змішувач Arc Steel', price: 3199, qty: 2 },
	];

	get total(): number {
		return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
	}

	constructor(private _router: Router) {}

	onSubmit(): void {
		void this._router.navigate(['/order', 'DEMO-0001']);
	}
}
