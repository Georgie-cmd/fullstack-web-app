import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDetailsDto } from 'src/dto/registration/register-details.dto';
import { RegisterUserDto } from 'src/dto/registration/register-user.dto';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';



@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private tokenService: TokenService 
    ) {}


    @Post('/registration') 
    async registration(@Body() registerDto: RegisterUserDto, registerDetailsDto: RegisterDetailsDto) {
        return this.authService.registration(registerDto, registerDetailsDto)
    }
}

