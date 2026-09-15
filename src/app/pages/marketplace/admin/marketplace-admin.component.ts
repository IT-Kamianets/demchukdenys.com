import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../feature/firebase/auth.service';
import { Order, ORDER_STATUSES } from '../../../feature/marketplace/order.interface';
import { OrderService } from '../../../feature/marketplace/order.service';
import { isValidUaPhone } from '../../../feature/marketplace/phone.util';
import { Product } from '../../../feature/marketplace/product.interface';
import { ProductsService } from '../../../feature/marketplace/products.service';

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
	customerName: string;
	phone: string;
	status: string;
	total: number;
};

function emptyOrderForm(): OrderForm {
	return { customerName: '', phone: '', status: ORDER_STATUSES[0], total: 0 };
}

@Component({
	selector: 'app-marketplace-admin',
	imports: [FormsModule, DatePipe],
	templateUrl: './marketplace-admin.component.html',
	styles: [],
})
export class MarketplaceAdminPage implements OnInit {
	private readonly _productsService = inject(ProductsService);
	private readonly _orderService = inject(OrderService);
	private readonly _auth = inject(AuthService);
	private readonly _router = inject(Router);

	currentUser = this._auth.user;

	async ngOnInit(): Promise<void> {
		const user = await this._auth.ready();

		if (!user) {
			void this._router.navigate(['/login']);
			return;
		}

		this.ordersLoading.set(true);
		this.orders.set(await this._orderService.getAll());
		this.ordersLoading.set(false);
	}

	async logout(): Promise<void> {
		await this._auth.signOutUser();
		void this._router.navigate(['/login']);
	}

	tab = signal<'products' | 'orders'>('products');
	products = this._productsService.products;
	editingId = signal<string | null>(null);
	form: ProductForm = { ...EMPTY_FORM };

	statuses = ORDER_STATUSES;
	orders = signal<Order[]>([]);
	ordersLoading = signal(true);

	creatingOrder = signal(false);
	orderForm: OrderForm = emptyOrderForm();

	get orderPhoneValid(): boolean {
		return isValidUaPhone(this.orderForm.phone);
	}

	async updateOrderStatus(id: string, event: Event): Promise<void> {
		const status = (event.target as HTMLSelectElement).value;

		this.orders.update((list) => list.map((order) => (order.id === id ? { ...order, status } : order)));
		await this._orderService.updateStatus(id, status);
	}

	startCreateOrder(): void {
		this.creatingOrder.set(true);
		this.orderForm = emptyOrderForm();
	}

	cancelOrder(): void {
		this.creatingOrder.set(false);
		this.orderForm = emptyOrderForm();
	}

	async saveOrder(): Promise<void> {
		if (!this.orderForm.customerName.trim() || !this.orderPhoneValid) {
			return;
		}

		const id = await this._orderService.create({
			customerName: this.orderForm.customerName.trim(),
			phone: this.orderForm.phone.trim(),
			items: [],
			total: this.orderForm.total,
			status: this.orderForm.status,
			createdAt: Date.now(),
		});

		this.orders.update((list) => [
			{
				id,
				customerName: this.orderForm.customerName.trim(),
				phone: this.orderForm.phone.trim(),
				items: [],
				total: this.orderForm.total,
				status: this.orderForm.status,
				createdAt: Date.now(),
			},
			...list,
		]);
		this.cancelOrder();
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
