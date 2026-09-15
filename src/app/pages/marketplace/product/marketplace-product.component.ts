import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../../feature/marketplace/cart.service';
import { Product } from '../../../feature/marketplace/product.interface';
import { ProductsService } from '../../../feature/marketplace/products.service';
import { SeoService } from '../../../seo.service';

@Component({
	selector: 'app-marketplace-product',
	imports: [RouterLink],
	templateUrl: './marketplace-product.component.html',
	styles: [],
})
export class MarketplaceProductPage implements OnInit {
	private readonly _route = inject(ActivatedRoute);
	private readonly _productsService = inject(ProductsService);
	private readonly _seo = inject(SeoService);
	private readonly _router = inject(Router);
	private readonly _cart = inject(CartService);

	product: Product | undefined;
	specEntries: Array<[string, string]> = [];
	qty = 1;

	ngOnInit(): void {
		const id = this._route.snapshot.paramMap.get('id') ?? '';
		this.product = this._productsService.getById(id);
		this.specEntries = this.product ? Object.entries(this.product.specs) : [];

		if (this.product) {
			this._seo.setPage({
				title: this.product.title,
				description: this.product.description,
				image: `/${this.product.image}`,
				robots: 'noindex, nofollow',
			});
		}
	}

	changeQty(delta: number): void {
		this.qty = Math.max(1, this.qty + delta);
	}

	addToCart(): void {
		if (!this.product) {
			return;
		}

		this._cart.add(this.product, this.qty);
		void this._router.navigate(['/cart']);
	}
}
