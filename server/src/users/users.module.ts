import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Token } from 'src/database/token.model';
import { User } from 'src/database/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';



@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Token]),
    forwardRef(() => AuthModule)
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [
    UsersService
  ]
})

export class UsersModule {}
