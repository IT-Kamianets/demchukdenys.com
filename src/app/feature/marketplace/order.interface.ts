export interface OrderItem {
	title: string;
	price: number;
	qty: number;
}

export interface Order {
	id: string;
	customerName: string;
	phone: string;
	city?: string;
	address?: string;
	comment?: string;
	paymentMethod?: string;
	items: OrderItem[];
	total: number;
	status: string;
	createdAt: number;
}

export const ORDER_STATUSES = [
	'Прийнято в обробку',
	'Підтверджено',
	'У виробництві',
	'Готово до відправки',
	'Доставлено',
	'Скасовано',
];
