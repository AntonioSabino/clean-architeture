import EventHandlerInterface from './event-handler.interface'
import EventInterface from './event.interface'

export default interface EventDispatcherInterface {
	notify(event: EventInterface): Promise<void> | void
	register(eventName: string, handler: EventHandlerInterface): void
	unregister(eventName: string, handler: EventHandlerInterface): void
	unregisterAll(): void
}
