import { Service, signal } from '@angular/core';
import { Product } from './product.interface';
import { loadProducts, saveProductOverrides } from './products.data';

@Service()
export class ProductsService {
	readonly products = signal<Product[]>(loadProducts());

	getById(id: string): Product | undefined {
		return this.products().find((product) => product.id === id);
	}

	upsert(product: Product): void {
		this.products.update((list) => {
			const next = list.some((item) => item.id === product.id)
				? list.map((item) => (item.id === product.id ? product : item))
				: [...list, product];

			saveProductOverrides(next);

			return next;
		});
	}

	remove(id: string): void {
		this.products.update((list) => {
			const next = list.filter((item) => item.id !== id);

			saveProductOverrides(next);

			return next;
		});
	}
}
