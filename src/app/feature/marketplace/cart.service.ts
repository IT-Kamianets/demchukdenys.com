import { computed, Service, signal } from '@angular/core';
import { CartItem } from './cart.interface';
import { Product } from './product.interface';

const STORAGE_KEY = 'marketplace-cart';

@Service()
export class CartService {
	readonly items = signal<CartItem[]>(readStoredCart());

	readonly total = computed(() => this.items().reduce((sum, item) => sum + item.price * item.qty, 0));
	readonly count = computed(() => this.items().reduce((sum, item) => sum + item.qty, 0));

	add(product: Product, qty: number): void {
		this.items.update((list) => {
			const existing = list.find((item) => item.id === product.id);
			const next = existing
				? list.map((item) => (item.id === product.id ? { ...item, qty: item.qty + qty } : item))
				: [
						...list,
						{ id: product.id, title: product.title, image: product.image, price: product.price, qty },
					];

			persist(next);

			return next;
		});
	}

	setQty(id: string, qty: number): void {
		this.items.update((list) => {
			const next = list.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item));

			persist(next);

			return next;
		});
	}

	remove(id: string): void {
		this.items.update((list) => {
			const next = list.filter((item) => item.id !== id);

			persist(next);

			return next;
		});
	}

	clear(): void {
		this.items.set([]);
		persist([]);
	}
}

function readStoredCart(): CartItem[] {
	if (typeof localStorage === 'undefined') {
		return [];
	}

	try {
		const raw = localStorage.getItem(STORAGE_KEY);

		return raw ? (JSON.parse(raw) as CartItem[]) : [];
	} catch {
		return [];
	}
}

function persist(items: CartItem[]): void {
	if (typeof localStorage === 'undefined') {
		return;
	}

	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
