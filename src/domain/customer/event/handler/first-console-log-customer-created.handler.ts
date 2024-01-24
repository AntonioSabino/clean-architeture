import EventHandlerInterface from '../../../@shared/event/event-handler.interface'
import CustomerCreatedEvent from '../customer-created.event'

export default class FirstConsoleLogCustomerCreatedHandler
	implements EventHandlerInterface<CustomerCreatedEvent>
{
	handle(_event: CustomerCreatedEvent) {
		console.log(`Esse é o primeiro console.log do evento: CustomerCreated`)
	}
}
