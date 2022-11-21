import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenService } from "src/auth/token.service";



@Injectable()
export class RefreshStrategyService extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        private tokenService: TokenService
    ) {
        super({
            ignoreExpiration: true,
            passReqToCallback: true,
            secretOrKey: process.env.SECRET_KEY,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    let secredData = request?.cookies['auth-cookie']

                    return secredData?.token
                }
            ])
        })
    }


    async validate(req: Request, payload: any) {
        if(!payload) {
            throw new BadRequestException('Invalid jwt token...')
        }
        

        let data = req?.cookies['auth-cookie']
        if(!data?.refresh_roken) {
            throw new BadRequestException('Invalid refresh token...')
        }


        let user = await this.tokenService.validateRefreshToken(payload.email, data.refresh_roken)
        if(!user) {
            throw new BadRequestException('Token has expired...')
        }

        return user 
    }
}