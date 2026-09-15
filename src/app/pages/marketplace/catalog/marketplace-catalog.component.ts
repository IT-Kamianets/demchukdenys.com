import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../../feature/marketplace/products.service';

@Component({
	selector: 'app-marketplace-catalog',
	imports: [RouterLink],
	templateUrl: './marketplace-catalog.component.html',
	styles: [],
})
export class MarketplaceCatalogPage {
	private readonly _productsService = inject(ProductsService);
	private readonly _products = this._productsService.products;

	category = signal<string | null>(null);

	categories = computed(() => Array.from(new Set(this._products().map((p) => p.category))));

	products = computed(() => {
		const category = this.category();

		return category ? this._products().filter((product) => product.category === category) : this._products();
	});

	setCategory(category: string | null): void {
		this.category.set(category);
	}
}
