import Customer from '../../entity/customer'
import EventInterface from '../@shared/event.interface'

export default class CustomerCreatedEvent implements EventInterface {
	dataTimeOccurred: Date
	eventData: {
		id: string
		name: string
	}

	constructor(eventData: Customer) {
		this.dataTimeOccurred = new Date()
		this.eventData = {
			id: eventData.id,
			name: eventData.name,
		}
	}
}
