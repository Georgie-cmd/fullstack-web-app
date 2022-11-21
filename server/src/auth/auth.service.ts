import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/dto/registration/register-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as ipify from 'ipify2';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import { RegisterDetailsDto } from 'src/dto/registration/register-details.dto';
import { CurrentUser } from 'src/dto/current-user.dto';




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


    async userValidation(email: string, password: string): Promise<CurrentUser> {
        const user = this.userService.searchbyEmail(email)
        if(!user) {
            throw new HttpException('Incorrect email or password...', HttpStatus.BAD_REQUEST)
        }

        let passwordEquals = await bcrypt.compare(password, (await user).password)
        if(!passwordEquals) {
            throw new HttpException('Incorrect email or password...', HttpStatus.BAD_REQUEST)
        }


        let currentUser = new CurrentUser()
        currentUser.id = (await user).id
        currentUser.first_name = (await user).first_name
        currentUser.last_name = (await user).last_name
        currentUser.role_in_company = (await user).role_in_company
        currentUser.email= (await user).email

        return currentUser 
    }
}
