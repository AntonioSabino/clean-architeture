import { Sequelize } from 'sequelize-typescript'
import CustomerModel from './model/customer.model'
import CustomerRepository from './customer.repository'
import Customer from '../../../../domain/customer/entity/customer'
import Address from '../../../../domain/customer/value-object/address'

describe('CustomerRepository', () => {
	let sequelize: Sequelize

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			sync: { force: true },
			logging: false,
		})

		sequelize.addModels([CustomerModel])
		await sequelize.sync()
	})

	afterAll(async () => {
		await sequelize.close()
	})

	it('should create a customer', async () => {
		const customerRepository = new CustomerRepository()
		const customer = new Customer('1', 'Customer 1')
		const address = new Address('Street 1', 1, '00000000', 'City 1')
		customer.changeAddress(address)

		await customerRepository.create(customer)

		const customerCreated = await CustomerModel.findOne({
			where: { id: '1' },
		})

		expect(customerCreated.toJSON()).toStrictEqual({
			id: '1',
			name: 'Customer 1',
			street: 'Street 1',
			number: 1,
			zipcode: '00000000',
			city: 'City 1',
			active: false,
			rewardPoints: 0,
		})
	})

	it('should update a customer', async () => {
		const customerRepository = new CustomerRepository()
		const customer = new Customer('1', 'Customer 1')
		const address = new Address('Street 1', 1, '00000000', 'City 1')
		customer.changeAddress(address)

		await customerRepository.create(customer)

		const customerUpdated = new Customer('1', 'Customer 1 Updated')
		const addressUpdated = new Address(
			'Street 1 Updated',
			1,
			'00000000',
			'City 1 Updated'
		)
		customerUpdated.changeAddress(addressUpdated)

		await customerRepository.update(customerUpdated)

		const customerCreated = await CustomerModel.findOne({
			where: { id: '1' },
		})

		expect(customerCreated.toJSON()).toStrictEqual({
			id: '1',
			name: 'Customer 1 Updated',
			street: 'Street 1 Updated',
			number: 1,
			zipcode: '00000000',
			city: 'City 1 Updated',
			active: false,
			rewardPoints: 0,
		})
	})

	it('should find a customer by id', async () => {
		const customerRepository = new CustomerRepository()
		const customer = new Customer('1', 'Customer 1')
		const address = new Address('Street 1', 1, '00000000', 'City 1')
		customer.changeAddress(address)

		await customerRepository.create(customer)

		const customerFound = await customerRepository.find('1')

		expect(customerFound).toStrictEqual(customer)
	})

	it('should find all customers', async () => {
		const customerRepository = new CustomerRepository()
		const customer1 = new Customer('1', 'Customer 1')
		const address1 = new Address('Street 1', 1, '00000000', 'City 1')
		customer1.changeAddress(address1)

		const customer2 = new Customer('2', 'Customer 2')
		const address2 = new Address('Street 2', 2, '00000000', 'City 2')
		customer2.changeAddress(address2)

		await customerRepository.create(customer1)
		await customerRepository.create(customer2)

		const customersFound = await customerRepository.findAll()

		expect(customersFound).toStrictEqual([customer1, customer2])
	})

	it('should throw an error when trying to find a customer by id that does not exist', async () => {
		const customerRepository = new CustomerRepository()

		await expect(customerRepository.find('1')).rejects.toThrow(
			'Customer not found'
		)
	})
})
