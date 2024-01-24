import EventHandlerInterface from '../../@shared/event-handler.interface'
import AddressChangedEvent from '../address-changed.event'

export default class ConsoleLogAddressChangedHandler
	implements EventHandlerInterface<AddressChangedEvent>
{
	handle(event: AddressChangedEvent) {
		const { id, name, newAddress } = event.eventData
		console.log(
			`Endereço do cliente ${id}, ${name} alterado para: ${newAddress}`
		)
	}
}
