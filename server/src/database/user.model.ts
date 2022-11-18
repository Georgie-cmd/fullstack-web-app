import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Token } from "./token.model";



@Table({tableName: 'users'})
export class User extends Model<User> {
    @ForeignKey(() => Token)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @Column({type: DataType.STRING, allowNull: false})
    first_name: string

    @Column({type: DataType.STRING, allowNull: false})
    last_name: string

    @Column({type: DataType.STRING, allowNull: false})
    role_in_company: string
    
    @Column({type: DataType.STRING, unique: false, allowNull: false})
    email: string

    @Column({type: DataType.STRING, allowNull: false})
    password: string

    @BelongsTo(() => Token)
    token: Token
} 