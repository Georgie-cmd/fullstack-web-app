import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from 'src/database/token.model';
import { User } from 'src/database/user.model';
import { CreateUserDetails } from 'src/dto/creating/create-details.dto';
import { CreateUserDto } from 'src/dto/creating/create-user.dto';
import { CurrentUser } from 'src/dto/current-user.dto';



@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Token) private tokenRepository: typeof Token
    ) {}

        /* searching */
    async searchbyEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({where: {email}})
    }
    
    async searchById(id: any): Promise<User> {
        return await this.userRepository.findOne({where: {id}})
    }

        /* creating */
    async createUser(userDto: CreateUserDto): Promise<CreateUserDto> {
        return await this.userRepository.create(userDto)
    }

    async createUserDetails(userDtoDetails: CreateUserDetails): Promise<CreateUserDetails> {
        return await this.tokenRepository.create(userDtoDetails)
    }
}
