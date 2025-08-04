import { faker } from "@faker-js/faker";

export type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	imgSrc: string;
};

export function createProducts(count: number): Product[] {
	const products: Product[] = [];
	for (let i = 0; i < count; i++) {
		products.push({
			id: faker.string.uuid(),
			name: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			price: Number.parseFloat(faker.commerce.price()),
			imgSrc: "https://placecats.com/300/400",
		});
	}
	return products;
}
