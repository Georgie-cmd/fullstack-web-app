import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";



@Injectable() 
export class JwtStrategyService extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    let secretData = request?.cookies['auth-cookie']
                    
                    return secretData?.token
                }
            ])
        })
    }


    async validate(payload: any) {
        if(!payload) {
            return new UnauthorizedException()
        }

        return payload
    }
}