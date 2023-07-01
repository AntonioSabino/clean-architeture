import Address from './address'

export default class Customer {
  _id: string
  _name: string = ''
  _address!: Address
  _active: boolean = false

  constructor(id: string, name: string) {
    this._id = id
    this._name = name
    this.validate()
  }

  validate(): void {
    if (this._name.length === 0) {
      throw new Error('Name must be at least 5 characters long')
    }
    if (this._id.length === 0) {
      throw new Error('Id is required')
    }
  }

  changeName(name: string): void {
    this._name = name
    this.validate()
  }

  activate(): void {
    if (this._address === undefined) {
      throw new Error('Address is required')
    }
    this._active = true
  }

  desactivate(): void {
    this._active = false
  }

  set address(address: Address) {
    this._address = address
  }
}
