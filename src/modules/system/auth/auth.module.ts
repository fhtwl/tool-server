import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthController from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUser } from '../user/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { JwtStrategy } from '../../../common/strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: {
        expiresIn: configuration().jwt.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([SystemUser]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export default class AuthModule {}
