import Order from '../entity/order'

export default class OrderService {
	static getTotalPrice(orders: Order[]): number {
		return orders.reduce((total, order) => {
			return total + order.calculateTotalPrice()
		}, 0)
	}
}
