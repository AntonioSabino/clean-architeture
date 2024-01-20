import Order from '../entity/order'
import OrderItem from '../entity/order_item'
import OrderService from './order.service'

describe('OrderService', () => {
	it('should get total price of all orders', () => {
		const item1 = new OrderItem('1', 'Product 1', 100, 'p1', 5)
		const item2 = new OrderItem('2', 'Product 2', 200, 'p2', 2)
		const items = [item1, item2]

		const order = new Order('o1', 'c1', [item1])
		const order2 = new Order('o2', 'c2', [item2])

		const total = OrderService.getTotalPrice([order, order2])

		expect(total).toEqual(900)
	})
})
