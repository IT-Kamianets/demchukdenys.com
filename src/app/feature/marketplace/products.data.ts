import productsData from '../../../data/marketplace/products.json';
import { Product } from './product.interface';

export const staticProducts: Product[] = productsData as unknown as Product[];

const ADMIN_OVERRIDES_KEY = 'marketplace-admin-products';

/** Merges the static catalog with any admin-created overrides stored in localStorage. */
export function loadProducts(): Product[] {
	const overrides = readOverrides();

	if (!overrides) {
		return staticProducts;
	}

	const byId = new Map(staticProducts.map((product) => [product.id, product]));

	for (const product of overrides) {
		byId.set(product.id, product);
	}

	return Array.from(byId.values());
}

export function saveProductOverrides(products: Product[]): void {
	if (typeof localStorage === 'undefined') {
		return;
	}

	localStorage.setItem(ADMIN_OVERRIDES_KEY, JSON.stringify(products));
}

function readOverrides(): Product[] | null {
	if (typeof localStorage === 'undefined') {
		return null;
	}

	try {
		const raw = localStorage.getItem(ADMIN_OVERRIDES_KEY);

		return raw ? (JSON.parse(raw) as Product[]) : null;
	} catch {
		return null;
	}
}
