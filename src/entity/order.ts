import OrderItem from "./order_item"

export default class Order {
  private _id: string
  private _customerId: string
  private _items: OrderItem[]
  private _total: number

  constructor(id: string, customerId: string, items: OrderItem[] = []) {
    this._id = id
    this._customerId = customerId
    this._items = items
    this._total = this.calculateTotal()
    this.validate()
  }

  validate(): void {
    if (this._id.length === 0) {
      throw new Error('Id is required')
    }
    if (this._customerId.length === 0) {
      throw new Error('CustomerId is required')
    }
    if (this._items.length === 0) {
      throw new Error('Items are required')
    }
  }

  calculateTotal(): number {
    return this._items.reduce((total, item) => total + item.price, 0)
  }
}
