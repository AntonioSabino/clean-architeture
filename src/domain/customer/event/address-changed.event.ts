import Address from '../value-object/address'
import Customer from '../entity/customer'
import EventInterface from '../../@shared/event/event.interface'

export default class AddressChangedEvent implements EventInterface {
	dataTimeOccurred: Date
	eventData: {
		id: string
		name: string
		newAddress: Address
	}

	constructor(customer: Customer) {
		this.dataTimeOccurred = new Date()
		this.eventData = {
			id: customer.id,
			name: customer.name,
			newAddress: customer.address,
		}
	}
}
