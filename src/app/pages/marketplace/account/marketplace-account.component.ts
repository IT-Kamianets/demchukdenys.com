import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type MockOrder = {
	id: string;
	date: string;
	status: string;
	total: number;
};

@Component({
	selector: 'app-marketplace-account',
	imports: [RouterLink],
	templateUrl: './marketplace-account.component.html',
	styles: [],
})
export class MarketplaceAccountPage {
	customerName = 'Тестовий Клієнт';
	orders: MockOrder[] = [
		{ id: 'DEMO-0001', date: '01.09.2026', status: 'Прийнято в обробку', total: 49296 },
		{ id: 'DEMO-0000', date: '12.08.2026', status: 'Доставлено', total: 18499 },
	];
}
