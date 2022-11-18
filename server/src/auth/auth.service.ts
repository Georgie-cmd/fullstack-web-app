import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/dto/registration/register-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as ipify from 'ipify2';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import { RegisterDetailsDto } from 'src/dto/registration/register-details.dto';




@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService
    ) {}


    async registration(registerDto: RegisterUserDto, registerDetailsDto: RegisterDetailsDto): Promise<any> {
        const candidate = await this.userService.searchbyEmail(registerDto.email)
        if(candidate) {
            throw new HttpException('This user already exists...', HttpStatus.BAD_REQUEST)
        }

        if(registerDto.password !== registerDto.password_confirmation) {
            throw new HttpException('Passwords are not the same...', HttpStatus.BAD_REQUEST)
        } else {
            const hashedPassword = await bcrypt.hash(registerDto.password, 13)
            const ip = await ipify.ipv4()
            const userTokens = {
                refresh_token: randomToken.generate(20),
                refresh_token_exp: moment().day(62).format('YYYY/MM/DD')
            }

            await this.userService.createUserDetails({
                ...registerDetailsDto,
                refresh_token: userTokens.refresh_token,
                refresh_token_exp: userTokens.refresh_token_exp,
                ip_address: ip
            })

            return await this.userService.createUser({
                ...registerDto,
                password: hashedPassword
            })
        }
    }
}
