import { Sequelize } from 'sequelize-typescript'
import CustomerModel from '../../../customer/repository/sequelize/model/customer.model'
import OrderItemModel from './model/order-item.model'
import ProductModel from '../../../product/repository/sequelize/model/product.model'
import CustomerRepository from '../../../customer/repository/sequelize/customer.repository'
import Customer from '../../../../domain/customer/entity/customer'
import Address from '../../../../domain/customer/value-object/address'
import ProductRepository from '../../../product/repository/sequelize/product.repository'
import Product from '../../../../domain/product/entity/product'
import OrderItem from '../../../../domain/checkout/entity/order_item'
import Order from '../../../../domain/checkout/entity/order'
import OrderRepository from './order.repository'
import OrderModel from './model/order.model'
import { or } from 'sequelize'

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

	it('should update an order', async () => {
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

		const orderItemUpdated = new OrderItem(
			'1',
			product.name,
			product.price,
			product.id,
			3
		)

		const orderUpdated = new Order(order.id, customer.id, [orderItemUpdated])

		await orderRepository.update(orderUpdated)

		const orderUpdatedFromDb = await OrderModel.findOne({
			where: { id: order.id },
			include: ['items'],
		})

		expect(orderUpdatedFromDb.toJSON()).toStrictEqual({
			id: 'orderId',
			customer_id: '123',
			total: orderUpdated.calculateTotalPrice(),
			items: [
				{
					id: orderItemUpdated.id,
					name: orderItemUpdated.name,
					price: orderItemUpdated.price,
					quantity: orderItemUpdated.quantity,
					order_id: orderUpdated.id,
					product_id: orderItemUpdated.productId,
				},
			],
		})
	})

	it('should throw an error when updating an order that does not exist', async () => {
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

		await expect(orderRepository.update(order)).rejects.toThrow(
			'Order not found'
		)
	})

	it('should find an order by id', async () => {
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

		const orderFound = await orderRepository.find(order.id)

		expect(orderCreated.toJSON()).toStrictEqual({
			id: orderFound.id,
			customer_id: orderFound.customerId,
			total: orderFound.calculateTotalPrice(),
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

	it('should throw an error when finding an order that does not exist', async () => {
		const orderRepository = new OrderRepository()

		await expect(orderRepository.find('orderId')).rejects.toThrow(
			'Order not found'
		)
	})

	it('should find all orders', async () => {
		const customerRepository = new CustomerRepository()
		const customer1 = new Customer('1', 'Customer 1')
		const address1 = new Address('Street 1', 123, 'City 1', 'State 1')
		customer1.changeAddress(address1)
		await customerRepository.create(customer1)

		const productRepository = new ProductRepository()
		const product1 = new Product('1', 'Product 1', 10)
		const product2 = new Product('2', 'Product 2', 20)
		await productRepository.create(product1)
		await productRepository.create(product2)

		const orderItem1 = new OrderItem(
			'1',
			product1.name,
			product1.price,
			product1.id,
			2
		)
		const orderItem2 = new OrderItem(
			'2',
			product2.name,
			product2.price,
			product2.id,
			3
		)

		const order1 = new Order('1', customer1.id, [orderItem1])
		const order2 = new Order('2', customer1.id, [orderItem2])

		const orderRepository = new OrderRepository()
		await orderRepository.create(order1)
		await orderRepository.create(order2)

		const ordersFound = await orderRepository.findAll()

		expect(ordersFound).toHaveLength(2)

		expect(ordersFound[0]).toMatchObject({
			id: order1.id,
			customerId: order1.customerId,
			items: expect.arrayContaining([
				expect.objectContaining({
					id: orderItem1.id,
					name: orderItem1.name,
					price: orderItem1.price,
					productId: orderItem1.productId,
					quantity: orderItem1.quantity,
				}),
			]),
		})

		expect(ordersFound[1]).toMatchObject({
			id: order2.id,
			customerId: order2.customerId,
			items: expect.arrayContaining([
				expect.objectContaining({
					id: orderItem2.id,
					name: orderItem2.name,
					price: orderItem2.price,
					productId: orderItem2.productId,
					quantity: orderItem2.quantity,
				}),
			]),
		})
	})
})
