import { JwtService } from "@nestjs/jwt";
import { CurrentUser } from "src/dto/current-user.dto";
import { UsersService } from "src/users/users.service";
import * as ipify from 'ipify2';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import { InjectModel } from "@nestjs/sequelize";
import { Token } from "src/database/token.model";
import { User } from "src/database/user.model";



export class TokenService {
    constructor(
        private JwtService: JwtService,
        private UsersService: UsersService,
        @InjectModel(Token) private tokenRepository: typeof Token,
        @InjectModel(User) private userRepository: typeof User
    ) {}


        /* JWT  */
    async getJwtToken(currentUser: CurrentUser): Promise<string> {
        let payload = {
            id: currentUser.id,
            email: currentUser.email
        }

        return this.JwtService.signAsync(payload)
    }

        /* Refresh Token */
    async getRefreshToken(id: string): Promise<string> {
        const userDataToUpdate = {
            refresh_roken: randomToken.generate(20),
            refresh_token_exp: moment().day(62).format('YYYY/MM/DD'),
        }

        await this.tokenRepository.update({
            refresh_token: userDataToUpdate.refresh_roken,
            refresh_token_exp: userDataToUpdate.refresh_token_exp,
            ip_address: (await ipify.ipv4()).toString()
        }, {where: {id: id}})

        return userDataToUpdate.refresh_roken
    }

        /* Refresh Token's validation */
    async validateRefreshToken(email: string, refresh_roken: string): Promise<CurrentUser> {
        const currentDate = moment().day(62).format('YYYY/MM/DD')
        
        let user = await this.userRepository.findOne({
            where: {
                email: email
            }
        })
        if(!user) {
            return null
        }

        let userToken = await this.tokenRepository.findOne({
            where: {
                refresh_token: refresh_roken,
                refresh_token_exp: currentDate
            }
        })
        if(!userToken) {
            return null
        }


        let currentUser = new CurrentUser()
        currentUser.id = user.id
        currentUser.first_name = user.first_name
        currentUser.last_name = user.last_name
        currentUser.role_in_company = user.role_in_company
        currentUser.email = user.email

        return currentUser
    }
}