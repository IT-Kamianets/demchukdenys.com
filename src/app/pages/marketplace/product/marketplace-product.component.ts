import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../feature/marketplace/product.interface';
import { ProductsService } from '../../../feature/marketplace/products.service';
import { SeoService } from '../../../seo.service';

@Component({
	selector: 'app-marketplace-product-detail',
	imports: [RouterLink],
	templateUrl: './marketplace-product-detail.component.html',
	styles: [],
})
export class MarketplaceProductDetailPage implements OnInit {
	private readonly _route = inject(ActivatedRoute);
	private readonly _productsService = inject(ProductsService);
	private readonly _seo = inject(SeoService);

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
}
