import Order from '../../domain/entity/order'
import OrderItem from '../../domain/entity/order_item'
import OrderRepositoryInterface from '../../domain/repository/order.repository.interface'
import OrderItemModel from '../db/sequelize/model/order-item.model'
import OrderModel from '../db/sequelize/model/order.model'

export default class OrderRepository implements OrderRepositoryInterface {
	async create(entity: Order): Promise<void> {
		await OrderModel.create(
			{
				id: entity.id,
				customer_id: entity.customerId,
				total: entity.calculateTotalPrice(),
				items: entity.items.map((item) => ({
					id: item.id,
					name: item.name,
					price: item.price,
					product_id: item.productId,
					quantity: item.quantity,
				})),
			},
			{
				include: [
					{
						model: OrderItemModel,
					},
				],
			}
		)
	}

	async update(entity: Order): Promise<void> {
		const existingOrder = await OrderModel.findByPk(entity.id)

		if (!existingOrder) {
			throw new Error('Order not found')
		}

		existingOrder.customer_id = entity.customerId
		existingOrder.total = entity.calculateTotalPrice()

		await OrderItemModel.destroy({
			where: {
				order_id: entity.id,
			},
		})

		await OrderItemModel.bulkCreate(
			entity.items.map((item) => ({
				id: item.id,
				name: item.name,
				price: item.price,
				product_id: item.productId,
				quantity: item.quantity,
				order_id: entity.id,
			}))
		)

		await existingOrder.save()
	}

	async find(id: string): Promise<Order> {
		const orderModel = await OrderModel.findOne({
			where: { id },
			include: ['items'],
		})

		if (!orderModel) {
			throw new Error('Order not found')
		}

		return new Order(
			orderModel.getDataValue('id'),
			orderModel.getDataValue('customer_id'),
			orderModel.getDataValue('items').map((item: OrderItemModel) => ({
				id: item.id,
				name: item.name,
				price: item.price,
				productId: item.product_id,
				quantity: item.quantity,
			}))
		)
	}

	async findAll(): Promise<Order[]> {
		const orderModels = await OrderModel.findAll({
			include: ['items'],
		})

		return orderModels.map(
			(orderModel) =>
				new Order(
					orderModel.getDataValue('id'),
					orderModel.getDataValue('customer_id'),
					orderModel.getDataValue('items').map((item: OrderItemModel) => ({
						id: item.id,
						name: item.name,
						price: item.price,
						productId: item.product_id,
						quantity: item.quantity,
					}))
				)
		)
	}
}
