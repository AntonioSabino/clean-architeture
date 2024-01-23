import {
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript'

@Table({
	tableName: 'product',
	timestamps: false,
})
export default class ProductModel extends Model {
	@PrimaryKey
	@Column({ type: DataType.STRING, allowNull: false })
	declare id: string

	@Column({ allowNull: false })
	declare name: string

	@Column({ allowNull: false })
	declare price: number
}
