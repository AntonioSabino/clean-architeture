import Address from './domain/entity/address'
import Customer from './domain/entity/customer'
import Order from './domain/entity/order'
import OrderItem from './domain/entity/order_item'

const customer = new Customer('123', 'Antonio Sabino')
const address = new Address('Rua das Rosas', '37', '09404110', 'Ribeirão Pires')
customer.address = address
customer.activate()

const item1 = new OrderItem('1', 'Item 1', 10, '1', 1)
const item2 = new OrderItem('2', 'Item 2', 20, '2', 2)
const item3 = new OrderItem('3', 'Item 3', 30, '3', 3)

const order = new Order('1', '123', [item1, item2, item3])
