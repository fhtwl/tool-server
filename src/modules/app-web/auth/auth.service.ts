import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { EmailLoginDto } from './dto/login.dot';

@Injectable()
export class AppAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}
  async emailPasswordLogin(data: EmailLoginDto) {
    const { email, password } = data;
    const user = await this.userRepository.findOne({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      return {
        code: '100000',
        data: null,
        message: '邮箱不存在或密码错误',
      };
    }
    return {
      data: { token: this.getToken(user) },
    };
  }

  getToken(user: User) {
    const payload = {
      uid: user.id,
      scope: 1,
    };
    return this.jwtService.sign(payload);
  }
}
