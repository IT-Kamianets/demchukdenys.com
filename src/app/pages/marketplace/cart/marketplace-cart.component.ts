import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../feature/marketplace/cart.service';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-marketplace-cart',
	imports: [RouterLink],
	templateUrl: './marketplace-cart.component.html',
	styles: [],
})
export class MarketplaceCartPage {
	private readonly _cart = inject(CartService);

	phoneDisplay = environment.phoneDisplay;
	phoneHref = environment.phoneHref;

	items = this._cart.items;
	total = this._cart.total;

	changeQty(id: string, delta: number, currentQty: number): void {
		this._cart.setQty(id, currentQty + delta);
	}

	remove(id: string): void {
		this._cart.remove(id);
	}
}
