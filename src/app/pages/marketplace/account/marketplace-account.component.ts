import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Order } from '../../../feature/marketplace/order.interface';
import { OrderService } from '../../../feature/marketplace/order.service';

@Component({
	selector: 'app-marketplace-account',
	imports: [RouterLink, DatePipe],
	templateUrl: './marketplace-account.component.html',
	styles: [],
})
export class MarketplaceAccountPage implements OnInit {
	private readonly _orderService = inject(OrderService);

	customerName = 'Особистий кабінет';
	orders = signal<Order[]>([]);
	loading = signal(true);

	async ngOnInit(): Promise<void> {
		try {
			this.orders.set(await this._orderService.getAll());
		} catch {
			// Listing all orders requires the admin login (Firestore rules) — a signed-out
			// visitor simply sees an empty history instead of a crash.
			this.orders.set([]);
		}

		this.loading.set(false);
	}
}
