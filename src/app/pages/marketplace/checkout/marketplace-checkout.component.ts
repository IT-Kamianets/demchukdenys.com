import { afterNextRender, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../feature/marketplace/cart.service';
import { NovaPoshtaCity } from '../../../feature/marketplace/nova-poshta-city.interface';
import { NovaPoshtaWarehouse } from '../../../feature/marketplace/nova-poshta-warehouse.interface';
import { NovaPoshtaService } from '../../../feature/marketplace/nova-poshta.service';
import { OrderService } from '../../../feature/marketplace/order.service';
import { isValidUaPhone } from '../../../feature/marketplace/phone.util';
import { environment } from '../../../../environments/environment';

const MAX_CITY_SUGGESTIONS = 8;
const MAX_WAREHOUSE_SUGGESTIONS = 8;

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
	private readonly _novaPoshta = inject(NovaPoshtaService);
	private _cities: NovaPoshtaCity[] | null = null;
	private _warehouses: NovaPoshtaWarehouse[] | null = null;
	private _selectedCityRef: string | null = null;

	name = '';
	phone = '';
	city = '';
	address = '';
	comment = '';
	paymentMethod: 'cash' | 'transfer' | 'card' = 'cash';
	submitting = false;
	error = '';

	citySuggestions = signal<NovaPoshtaCity[]>([]);
	showCitySuggestions = signal(false);

	warehouseSuggestions = signal<NovaPoshtaWarehouse[]>([]);
	showWarehouseSuggestions = signal(false);

	phoneDisplay = environment.phoneDisplay;
	phoneHref = environment.phoneHref;

	items = this._cart.items;
	total = this._cart.total;

	// The cart lives in localStorage, which the server can't read, so it always renders empty
	// during SSR. Gate the cart-dependent branch behind a browser-only flag so the client's
	// first render matches the server's and hydration doesn't have to repair a mismatch.
	ready = signal(false);

	constructor() {
		afterNextRender(() => this.ready.set(true));
	}

	get phoneValid(): boolean {
		return isValidUaPhone(this.phone);
	}

	onCityChange(): void {
		if (this._selectedCityRef) {
			this._selectedCityRef = null;
			this._warehouses = null;
			this.address = '';
		}
	}

	async onCityInput(): Promise<void> {
		const query = this.city.trim().toLowerCase();

		if (query.length < 2) {
			this.citySuggestions.set([]);
			this.showCitySuggestions.set(false);

			return;
		}

		this._cities ??= await this._novaPoshta.getCities();

		const matches = this._cities
			.filter((city) => city.name.toLowerCase().startsWith(query))
			.sort((a, b) => (a.settlementType === b.settlementType ? 0 : a.settlementType === 'місто' ? -1 : 1))
			.slice(0, MAX_CITY_SUGGESTIONS);

		this.citySuggestions.set(matches);
		this.showCitySuggestions.set(matches.length > 0);
	}

	selectCity(city: NovaPoshtaCity): void {
		this.city = city.name;
		this.showCitySuggestions.set(false);

		if (this._selectedCityRef !== city.ref) {
			this._selectedCityRef = city.ref;
			this._warehouses = null;
			this.address = '';
		}
	}

	hideCitySuggestions(): void {
		// Delay so a click on a suggestion registers before the list is hidden.
		setTimeout(() => this.showCitySuggestions.set(false), 150);
	}

	async onAddressInput(): Promise<void> {
		if (!this._selectedCityRef) {
			this.warehouseSuggestions.set([]);
			this.showWarehouseSuggestions.set(false);

			return;
		}

		this._warehouses ??= (await this._novaPoshta.getWarehouses(this._selectedCityRef)).slice().sort(
			(a, b) => (parseInt(a.number, 10) || 0) - (parseInt(b.number, 10) || 0),
		);

		const query = this.address.trim().toLowerCase();
		const isNumeric = /^\d+$/.test(query);
		const matches = (
			!query
				? this._warehouses
				: isNumeric
					? this._warehouses.filter((warehouse) => warehouse.number.includes(query))
					: this._warehouses.filter(
							(warehouse) =>
								warehouse.number.toLowerCase().startsWith(query) ||
								warehouse.shortAddress.toLowerCase().includes(query) ||
								warehouse.name.toLowerCase().includes(query),
						)
		).slice(0, MAX_WAREHOUSE_SUGGESTIONS);

		this.warehouseSuggestions.set(matches);
		this.showWarehouseSuggestions.set(matches.length > 0);
	}

	selectWarehouse(warehouse: NovaPoshtaWarehouse): void {
		this.address = `№${warehouse.number}: ${warehouse.shortAddress}`;
		this.showWarehouseSuggestions.set(false);
	}

	hideWarehouseSuggestions(): void {
		// Delay so a click on a suggestion registers before the list is hidden.
		setTimeout(() => this.showWarehouseSuggestions.set(false), 150);
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
