import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../feature/marketplace/cart.service';
import { OrderService } from '../../../feature/marketplace/order.service';
import { isValidUaPhone } from '../../../feature/marketplace/phone.util';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-marketplace-checkout',
	imports: [FormsModule, RouterLink],
	templateUrl: './marketplace-checkout.component.html',
	styles: [],
})
export class MarketplaceCheckoutPage {
	private readonly _orderService = inject(OrderService);
	private readonly _cart = inject(CartService);
	private readonly _router = inject(Router);

	name = '';
	phone = '';
	city = '';
	address = '';
	comment = '';
	paymentMethod: 'cash' | 'transfer' | 'card' = 'cash';
	submitting = false;
	error = '';

	phoneDisplay = environment.phoneDisplay;
	phoneHref = environment.phoneHref;

	items = this._cart.items;
	total = this._cart.total;

	get phoneValid(): boolean {
		return isValidUaPhone(this.phone);
	}

	async onSubmit(): Promise<void> {
		if (!this.name.trim() || !this.phoneValid || this.items().length === 0) {
			return;
		}

		this.submitting = true;
		this.error = '';

		try {
			const id = await this._orderService.create({
				customerName: this.name.trim(),
				phone: this.phone.trim(),
				city: this.city.trim(),
				address: this.address.trim(),
				comment: this.comment.trim(),
				paymentMethod: this.paymentMethod,
				items: this.items().map(({ title, price, qty }) => ({ title, price, qty })),
				total: this.total(),
				status: 'Прийнято в обробку',
				createdAt: Date.now(),
			});

			this._cart.clear();
			void this._router.navigate(['/order', id]);
		} catch {
			this.error = 'Не вдалося оформити замовлення. Спробуйте ще раз або зателефонуйте нам.';
		} finally {
			this.submitting = false;
		}
	}
}
