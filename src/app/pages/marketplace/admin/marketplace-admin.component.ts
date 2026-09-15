import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../feature/marketplace/product.interface';
import { ProductsService } from '../../../feature/marketplace/products.service';

type MockOrder = {
	id: string;
	customerName: string;
	date: string;
	status: string;
	total: number;
};

export const ORDER_STATUSES = [
	'Прийнято в обробку',
	'Підтверджено',
	'У виробництві',
	'Готово до відправки',
	'Доставлено',
	'Скасовано',
];

type ProductForm = Omit<Product, 'specs'>;

const EMPTY_FORM: ProductForm = {
	id: '',
	title: '',
	description: '',
	price: 0,
	currency: 'UAH',
	image: '',
	category: '',
	inStock: true,
};

type OrderForm = {
	id: string;
	customerName: string;
	date: string;
	status: string;
	total: number;
};

function todayDisplay(): string {
	const today = new Date();
	const day = String(today.getDate()).padStart(2, '0');
	const month = String(today.getMonth() + 1).padStart(2, '0');

	return `${day}.${month}.${today.getFullYear()}`;
}

@Component({
	selector: 'app-marketplace-admin',
	imports: [FormsModule],
	templateUrl: './marketplace-admin.component.html',
	styles: [],
})
export class MarketplaceAdminPage {
	private readonly _productsService = inject(ProductsService);

	tab = signal<'products' | 'orders'>('products');
	products = this._productsService.products;
	editingId = signal<string | null>(null);
	form: ProductForm = { ...EMPTY_FORM };

	statuses = ORDER_STATUSES;
	orders = signal<MockOrder[]>([
		{
			id: 'DEMO-0001',
			customerName: 'Тестовий Клієнт',
			date: '01.09.2026',
			status: 'Прийнято в обробку',
			total: 49296,
		},
		{
			id: 'DEMO-0000',
			customerName: 'Тестовий Клієнт',
			date: '12.08.2026',
			status: 'Доставлено',
			total: 18499,
		},
	]);

	creatingOrder = signal(false);
	orderForm: OrderForm = this._emptyOrderForm();

	updateOrderStatus(id: string, event: Event): void {
		const status = (event.target as HTMLSelectElement).value;

		this.orders.update((list) => list.map((order) => (order.id === id ? { ...order, status } : order)));
	}

	startCreateOrder(): void {
		this.creatingOrder.set(true);
		this.orderForm = this._emptyOrderForm();
	}

	cancelOrder(): void {
		this.creatingOrder.set(false);
		this.orderForm = this._emptyOrderForm();
	}

	saveOrder(): void {
		this.orders.update((list) => [{ ...this.orderForm }, ...list]);
		this.cancelOrder();
	}

	private _emptyOrderForm(): OrderForm {
		return {
			id: `DEMO-${String(this.orders().length).padStart(4, '0')}`,
			customerName: '',
			date: todayDisplay(),
			status: this.statuses[0],
			total: 0,
		};
	}

	startCreate(): void {
		this.editingId.set('__new__');
		this.form = { ...EMPTY_FORM, id: `product-${Date.now()}` };
	}

	startEdit(product: Product): void {
		this.editingId.set(product.id);
		const { specs, ...rest } = product;
		void specs;
		this.form = { ...rest };
	}

	cancelEdit(): void {
		this.editingId.set(null);
		this.form = { ...EMPTY_FORM };
	}

	save(): void {
		const existing = this._productsService.getById(this.form.id);

		this._productsService.upsert({
			...this.form,
			specs: existing?.specs ?? {},
		});
		this.cancelEdit();
	}

	remove(id: string): void {
		this._productsService.remove(id);
	}
}
