export interface Product {
	id: string;
	title: string;
	description: string;
	price: number;
	currency: string;
	image: string;
	category: string;
	inStock: boolean;
	stockQty?: number;
	specs: Record<string, string>;
}
