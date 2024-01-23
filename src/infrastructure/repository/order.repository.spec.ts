import { Sequelize } from 'sequelize-typescript'
import CustomerModel from '../db/sequelize/model/customer.model'
import OrderItemModel from '../db/sequelize/model/order-item.model'
import ProductModel from '../db/sequelize/model/product.model'
import CustomerRepository from './customer.repository'
import Customer from '../../domain/entity/customer'
import Address from '../../domain/entity/address'
import ProductRepository from './product.repository'
import Product from '../../domain/entity/product'
import OrderItem from '../../domain/entity/order_item'
import Order from '../../domain/entity/order'
import OrderRepository from './order.repository'
import OrderModel from '../db/sequelize/model/order.model'

describe('OrderRepository', () => {
	let sequelize: Sequelize

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			sync: { force: true },
			logging: false,
		})

		sequelize.addModels([
			CustomerModel,
			OrderModel,
			OrderItemModel,
			ProductModel,
		])
		await sequelize.sync()
	})

	afterAll(async () => {
		await sequelize.close()
	})

	it('should create a new order', async () => {
		const customerRepository = new CustomerRepository()
		const customer = new Customer('123', 'Customer 1')
		const address = new Address('Street 1', 123, 'City 1', 'State 1')
		customer.changeAddress(address)
		await customerRepository.create(customer)

		const productRepository = new ProductRepository()
		const product = new Product('1', 'Product 1', 10)
		await productRepository.create(product)

		const orderItem = new OrderItem(
			'1',
			product.name,
			product.price,
			product.id,
			2
		)

		const order = new Order('orderId', customer.id, [orderItem])

		const orderRepository = new OrderRepository()
		await orderRepository.create(order)

		const orderCreated = await OrderModel.findOne({
			where: { id: order.id },
			include: ['items'],
		})

		expect(orderCreated.toJSON()).toStrictEqual({
			id: 'orderId',
			customer_id: '123',
			total: order.calculateTotalPrice(),
			items: [
				{
					id: orderItem.id,
					name: orderItem.name,
					price: orderItem.price,
					quantity: orderItem.quantity,
					order_id: order.id,
					product_id: orderItem.productId,
				},
			],
		})
	})
})
