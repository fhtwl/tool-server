import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AppUserController } from './user.controller';
import { AppUserService } from './user.service';
import { AppAuthService } from '../auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { RedemptionCode } from 'src/modules/redemption-code/redemption-code.entity';
// import { JwtStrategy } from 'src/common/strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: {
        expiresIn: configuration().jwt.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([User, RedemptionCode]),
  ],
  controllers: [AppUserController],
  providers: [AppUserService, AppAuthService],
})
export default class AppUserModule {}
