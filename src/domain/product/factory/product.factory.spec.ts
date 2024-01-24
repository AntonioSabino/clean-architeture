import ProductFactory from './product.factory'

describe('ProductFactory', () => {
	it('should create a product a', () => {
		const product = ProductFactory.create('a', 'Product A', 10)

		expect(product.id).toBeDefined()
		expect(product.name).toBe('Product A')
		expect(product.price).toBe(10)
		expect(product.constructor.name).toBe('Product')
	})

	it('should create a product b', () => {
		const product = ProductFactory.create('b', 'Product B', 20)

		expect(product.id).toBeDefined()
		expect(product.name).toBe('Product B')
		expect(product.price).toBe(40)
		expect(product.constructor.name).toBe('ProductB')
	})

	it('should throw an error when product type is invalid', () => {
		expect(() => ProductFactory.create('c', 'Product C', 30)).toThrow(
			new Error('Invalid product type')
		)
	})
})
