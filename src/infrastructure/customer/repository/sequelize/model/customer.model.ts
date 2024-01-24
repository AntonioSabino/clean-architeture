import {
	Column,
	Model,
	PrimaryKey,
	Table,
	DataType,
} from 'sequelize-typescript'

@Table({
	tableName: 'customer',
	timestamps: false,
})
export default class CustomerModel extends Model {
	@PrimaryKey
	@Column({ type: DataType.STRING, allowNull: false })
	declare id: string

	@Column({ allowNull: false })
	declare name: string

	@Column({ allowNull: false })
	declare street: string

	@Column({ allowNull: false })
	declare city: string

	@Column({ allowNull: false })
	declare zipcode: string

	@Column({ allowNull: false })
	declare number: number

	@Column({ allowNull: false })
	declare active: boolean

	@Column({ allowNull: false })
	declare rewardPoints: number
}
