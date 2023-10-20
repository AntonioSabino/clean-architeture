import Order from "./order"
import OrderItem from "./order_item"

describe('Order', () => {
  it('should throw error when id is empty', () => {
    expect(() => new Order('', '123')).toThrowError('Id is required')
  })

  it('should throw error when customerId is empty', () => {
    expect(() => new Order('123', '')).toThrowError('CustomerId is required')
  })

  it('should throw error when items is empty', () => {
    expect(() => new Order('123', '123', [])).toThrowError('Items are required')
  })

  it('should calculate total', () => {
    const item = new OrderItem('i1', 'Item 1', 10)
    const item2 = new OrderItem('i2', 'Item 2', 20)
    const order = new Order('123', '123', [item])
    const order2 = new Order('123', '123', [item, item2])

    expect(order.calculateTotal()).toBe(10)
    expect(order2.calculateTotal()).toBe(30)
  })
})