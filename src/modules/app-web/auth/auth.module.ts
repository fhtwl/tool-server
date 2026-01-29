import { Module } from '@nestjs/common';
import { AppAuthService } from './auth.service';
import AppAuthController from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { JwtStrategy } from '../../../common/strategy/jwt.strategy';
import { User } from '../user/user.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: {
        expiresIn: configuration().jwt.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AppAuthService, JwtStrategy],
  controllers: [AppAuthController],
  exports: [AppAuthService],
})
export default class AppAuthModule {}
