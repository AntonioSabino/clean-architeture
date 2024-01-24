import Address from '../../../../domain/customer/value-object/address'
import Customer from '../../../../domain/customer/entity/customer'
import CustomerRepositoryInterface from '../../../../domain/customer/repository/customer.repository.interface'
import CustomerModel from './model/customer.model'

export default class CustomerRepository implements CustomerRepositoryInterface {
	async create(entity: Customer): Promise<void> {
		await CustomerModel.create({
			id: entity.id,
			name: entity.name,
			street: entity.address.street,
			city: entity.address.city,
			zipcode: entity.address.zip,
			number: entity.address.number,
			active: entity.isActivated(),
			rewardPoints: entity.rewardPoints,
		})
	}
	async update(entity: Customer): Promise<void> {
		await CustomerModel.update(
			{
				name: entity.name,
				street: entity.address.street,
				city: entity.address.city,
				zipcode: entity.address.zip,
				number: entity.address.number,
				active: entity.isActivated(),
				rewardPoints: entity.rewardPoints,
			},
			{ where: { id: entity.id } }
		)
	}
	async find(id: string): Promise<Customer> {
		const customerModel = await CustomerModel.findByPk(id)
		if (!customerModel) {
			throw new Error('Customer not found')
		}
		const customer = new Customer(customerModel.id, customerModel.name)

		const address = new Address(
			customerModel.street,
			customerModel.number,
			customerModel.zipcode,
			customerModel.city
		)

		customer.changeAddress(address)

		return customer
	}

	async findAll(): Promise<Customer[]> {
		const customerModels = await CustomerModel.findAll()
		const customers: Customer[] = []
		for (const customerModel of customerModels) {
			const customer = new Customer(customerModel.id, customerModel.name)

			const address = new Address(
				customerModel.street,
				customerModel.number,
				customerModel.zipcode,
				customerModel.city
			)

			customer.changeAddress(address)

			customers.push(customer)
		}
		return customers
	}
}
