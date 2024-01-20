import Order from './order'
import OrderItem from './order_item'

describe('Order', () => {
	it('should throw error when id is empty', () => {
		expect(() => new Order('', '123')).toThrowError('Id is required')
	})

	it('should throw error when customerId is empty', () => {
		expect(() => new Order('123', '')).toThrowError('CustomerId is required')
	})

	it('should throw error when items is empty', () => {
		expect(() => new Order('123', '123', [])).toThrowError('Items are required')
	})

	it('should calculate total', () => {
		const item = new OrderItem('i1', 'Item 1', 10, 'p1', 2)
		const item2 = new OrderItem('i2', 'Item 2', 20, 'p2', 2)
		const order = new Order('123', '123', [item])
		const order2 = new Order('123', '123', [item, item2])

		let total = order.calculateTotalPrice()

		expect(total).toBe(20)

		total = order2.calculateTotalPrice()

		expect(total).toBe(60)
	})

	it('should throw error when item quantity is less than 1', () => {
		expect(() => {
			const item = new OrderItem('i1', 'Item 1', 10, 'p1', 0)
			new Order('123', '123', [item])
		}).toThrowError('Item quantity must be greater than 0')
	})
})
