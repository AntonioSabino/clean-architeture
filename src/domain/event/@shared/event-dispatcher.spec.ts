import exp from 'constants'
import SendEmailWhenProductIsCreatedHandler from '../product/handler/send-email-when-product-is-created.handler'
import EventDispatcher from './event-dispatcher'
import ProductCreatedEvent from '../product/product-created.event'

describe('EventDispatcher', () => {
	it('should register an event handler', () => {
		const eventDispatcher = new EventDispatcher()
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
		const eventDispatcher = new EventDispatcher()
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
		const eventDispatcher = new EventDispatcher()
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
		const eventDispatcher = new EventDispatcher()
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
})
