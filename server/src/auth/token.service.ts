import { JwtService } from "@nestjs/jwt";
import { CurrentUser } from "src/dto/current-user.dto";
import { UsersService } from "src/users/users.service";
import * as ipify from 'ipify2';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import { InjectModel } from "@nestjs/sequelize";
import { Token } from "src/database/token.model";



export class TokenService {
    constructor(
        private JwtService: JwtService,
        private UsersService: UsersService,
        @InjectModel(Token) private tokenRepository: typeof Token
    ) {}



    async getJwtToken(currentUser: CurrentUser): Promise<string> {
        let payload = {
            id: currentUser.id,
            email: currentUser.email
        }

        return this.JwtService.signAsync(payload)
    }

    async getRefreshToken(id: string): Promise<string> {
        const ip = ipify.ipv4()
        const userDataToUpdate = {
            refresh_roken: randomToken.generate(20),
            refresh_token_exp: moment().day(62).format('YYYY/MM/DD'),
        }

        await this.tokenRepository.update({
            refresh_token: userDataToUpdate.refresh_roken,
            refresh_token_exp: userDataToUpdate.refresh_token_exp,
            ip_address: ip
        }, {where: {id: id}})

        return userDataToUpdate.refresh_roken
    }
}