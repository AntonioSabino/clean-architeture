import SendEmailWhenProductIsCreatedHandler from '../../product/event/handler/send-email-when-product-is-created.handler'
import EventDispatcher from './event-dispatcher'
import ProductCreatedEvent from '../../product/event/product-created.event'
import Customer from '../../customer/entity/customer'
import CustomerCreatedEvent from '../../customer/event/customer-created.event'
import FirstConsoleLogCustomerCreatedHandler from '../../customer/event/handler/first-console-log-customer-created.handler'
import SecondConsoleLogCustomerCreatedHandler from '../../customer/event/handler/second-console-log-customer-created.handler'
import exp from 'constants'
import AddressChangedEvent from '../../customer/event/address-changed.event'
import Address from '../../customer/value-object/address'
import ConsoleLogAddressChangedHandler from '../../customer/event/handler/console-log-address-changed.handle'

describe('EventDispatcher', () => {
	let eventDispatcher: EventDispatcher

	beforeEach(() => {
		eventDispatcher = new EventDispatcher()
	})

	it('should register an event handler', () => {
		const eventHandler = new SendEmailWhenProductIsCreatedHandler()

		eventDispatcher.register('ProductCreatedEvent', eventHandler)

		expect(
			eventDispatcher.getEventHandlers['ProductCreatedEvent']
		).toBeDefined()
		expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(
			1
		)
		expect(
			eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]
		).toBeInstanceOf(SendEmailWhenProductIsCreatedHandler)
	})

	it('should unregister an event handler', () => {
		const eventHandler = new SendEmailWhenProductIsCreatedHandler()

		eventDispatcher.register('ProductCreatedEvent', eventHandler)

		expect(
			eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]
		).toBeInstanceOf(SendEmailWhenProductIsCreatedHandler)

		eventDispatcher.unregister('ProductCreatedEvent', eventHandler)

		expect(
			eventDispatcher.getEventHandlers['ProductCreatedEvent']
		).toBeDefined()
		expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(
			0
		)
	})

	it('should unregister all event handlers', () => {
		const eventHandler = new SendEmailWhenProductIsCreatedHandler()

		eventDispatcher.register('ProductCreatedEvent', eventHandler)

		expect(
			eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]
		).toBeInstanceOf(SendEmailWhenProductIsCreatedHandler)

		eventDispatcher.unregisterAll()

		expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBe(
			undefined
		)
	})

	it('should notify an event', async () => {
		const eventHandler = new SendEmailWhenProductIsCreatedHandler()

		eventDispatcher.register('ProductCreatedEvent', eventHandler)

		expect(
			eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]
		).toBeInstanceOf(SendEmailWhenProductIsCreatedHandler)

		const productCreatedEvent = new ProductCreatedEvent({
			name: 'Product Name',
			description: 'Product Description',
			price: 100,
		})

		const spy = jest.spyOn(eventHandler, 'handle')

		eventDispatcher.notify(productCreatedEvent)

		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith(productCreatedEvent)

		eventDispatcher.notify(productCreatedEvent)

		expect(spy).toHaveBeenCalledTimes(2)
		expect(spy).toHaveBeenCalledWith(productCreatedEvent)
	})

	it('should register and notify CustomerCreatedEvent and CustomerAddressChangedEvent', async () => {
		const customer = new Customer('1', 'Customer 1')
		const customerCreatedEvent = new CustomerCreatedEvent(customer)

		const handler1 = new FirstConsoleLogCustomerCreatedHandler()
		const handler2 = new SecondConsoleLogCustomerCreatedHandler()

		eventDispatcher.register('CustomerCreatedEvent', handler1)
		eventDispatcher.register('CustomerCreatedEvent', handler2)

		const spy1 = jest.spyOn(handler1, 'handle')
		const spy2 = jest.spyOn(handler2, 'handle')

		eventDispatcher.notify(customerCreatedEvent)

		expect(spy1).toHaveBeenCalledTimes(1)
		expect(spy1).toHaveBeenCalledWith(customerCreatedEvent)
		expect(spy2).toHaveBeenCalledTimes(1)
		expect(spy2).toHaveBeenCalledWith(customerCreatedEvent)

		const address = new Address('Street', 123, 'zipcode', 'City')
		customer.changeAddress(address)
		const addressChangedEvent = new AddressChangedEvent(customer)

		const handler3 = new ConsoleLogAddressChangedHandler()

		eventDispatcher.register('AddressChangedEvent', handler3)

		const spy3 = jest.spyOn(handler3, 'handle')

		eventDispatcher.notify(addressChangedEvent)

		expect(spy3).toHaveBeenCalledTimes(1)
		expect(spy3).toHaveBeenCalledWith(addressChangedEvent)
	})
})
