import EventHandlerInterface from '../../@shared/event-handler.interface'
import CustomerCreatedEvent from '../customer-created.event'

export default class SecondConsoleLogCustomerCreatedHandler
	implements EventHandlerInterface<CustomerCreatedEvent>
{
	handle(_event: CustomerCreatedEvent) {
		console.log(`Esse é o segundo console.log do evento: CustomerCreated`)
	}
}
