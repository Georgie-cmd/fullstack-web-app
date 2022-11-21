import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "src/auth/auth.service";
import { CurrentUser } from "src/dto/current-user.dto";



@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super({usernameField: 'email'})
    }


    async validate(email: string, password: string): Promise<CurrentUser> {
        let user = this.authService.userValidation(email, password)
        if(user == null) {
            throw new UnauthorizedException()
        }

        return user
    }
}