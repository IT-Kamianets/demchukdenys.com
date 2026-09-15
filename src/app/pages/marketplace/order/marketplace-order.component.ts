import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order } from '../../../feature/marketplace/order.interface';
import { OrderService } from '../../../feature/marketplace/order.service';
import { SeoService } from '../../../seo.service';

@Component({
	selector: 'app-marketplace-order',
	imports: [RouterLink],
	templateUrl: './marketplace-order.component.html',
	styles: [],
})
export class MarketplaceOrderPage implements OnInit {
	private readonly _route = inject(ActivatedRoute);
	private readonly _orderService = inject(OrderService);
	private readonly _seo = inject(SeoService);

	order = signal<Order | null | undefined>(undefined);

	get total(): number {
		const order = this.order();

		return order?.items.reduce((sum, item) => sum + item.price * item.qty, 0) ?? 0;
	}

	async ngOnInit(): Promise<void> {
		const id = this._route.snapshot.paramMap.get('id') ?? '';
		const order = await this._orderService.getById(id);

		this.order.set(order);

		this._seo.setPage({
			title: order ? `Замовлення ${order.id}` : 'Замовлення не знайдено',
			description: 'Підтвердження замовлення.',
			robots: 'noindex, nofollow',
		});
	}
}
