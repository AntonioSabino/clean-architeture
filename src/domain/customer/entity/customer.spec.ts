import Address from '../value-object/address'
import Customer from './customer'

describe('Customer', () => {
	it('should throw error when id is empty', () => {
		expect(() => new Customer('', 'John')).toThrowError('Id is required')
	})

	it('should throw error when name is empty', () => {
		expect(() => new Customer('123', '')).toThrowError('Name is required')
	})

	it('should change name', () => {
		const customer = new Customer('123', 'John')
		customer.changeName('Mary')

		expect(customer.name).toBe('Mary')
	})

	it('should activate customer', () => {
		const customer = new Customer('123', 'Customer 123')
		const address = new Address('Street 1', 190, '12345-123', 'City')
		customer.changeAddress(address)

		customer.activate()

		expect(customer.isActivated()).toBeTruthy()
	})

	it('should throw error when activate customer without address', () => {
		const customer = new Customer('123', 'Customer 123')

		expect(() => customer.activate()).toThrowError('Address is required')
	})

	it('should desactivate customer', () => {
		const customer = new Customer('123', 'Customer 123')

		customer.desactivate()

		expect(customer.isActivated()).toBeFalsy()
	})

	it('should add reward points', () => {
		const customer = new Customer('123', 'Customer 123')
		expect(customer.rewardPoints).toBe(0)

		customer.addRewardPoints(10)
		expect(customer.rewardPoints).toBe(10)

		customer.addRewardPoints(20)
		expect(customer.rewardPoints).toBe(30)
	})
})
