import Address from '../value-object/address'
import CustomerFactory from './customer.factory'

describe('CustomerFactory', () => {
	it('should create a customer', () => {
		const customer = CustomerFactory.create('John Doe')

		expect(customer.id).toBeDefined()
		expect(customer.name).toBe('John Doe')
		expect(customer.address).toBeUndefined()
	})

	it('should create a customer with address', () => {
		const address = new Address('Street', 123, 'zip', 'city')

		const customer = CustomerFactory.createWithAddress('John Doe', address)

		expect(customer.id).toBeDefined()
		expect(customer.name).toBe('John Doe')
		expect(customer.address).toBe(address)
	})
})
