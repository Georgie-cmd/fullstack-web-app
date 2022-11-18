import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";



@Table({tableName: 'tokens'})
export class Token extends Model<Token> {
    @Column({type: DataType.STRING, allowNull: false})
    refresh_token: string
    
    @Column({type: DataType.STRING, allowNull: false})
    refresh_token_exp: string

    @Column({type: DataType.STRING, allowNull: false})
    ip_address: any

    @HasMany(() => User)
    users: User[]
}