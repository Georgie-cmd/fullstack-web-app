import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/database/user.model';
import { Token } from 'src/database/token.model';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { JwtStrategyService } from './strategies/jwt-strategy/jwt-strategy.service';
import { LocalStrategyService } from './strategies/local-strategy/local-strategy.service';
import { RefreshStrategyService } from './strategies/refresh-strategy/refresh-strategy.service';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env'
    }),
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Token]),
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRATION
      }
    })
  ],
  providers: [
    AuthService, 
    TokenService,
    JwtStrategyService,
    LocalStrategyService,
    RefreshStrategyService
  ],
  controllers: [AuthController],
  exports: [
    AuthService, 
    TokenService,
    JwtStrategyService,
    LocalStrategyService,
    RefreshStrategyService
  ]
})

export class AuthModule {}
