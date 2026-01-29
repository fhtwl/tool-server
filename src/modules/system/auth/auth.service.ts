import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemUser } from '../user/user.entity';
import { Repository } from 'typeorm';
import { PhonePasswordLoginDto, UserNameLoginDto } from './dto/login.dot';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SystemUser)
    private readonly userRepository: Repository<SystemUser>,

    private readonly jwtService: JwtService,
  ) {}

  // async phoneCodeLogin(data: PhoneCodeLoginDto) {
  //   const { phone } = data;
  //   const user = await this.userRepository.findOne({
  //     where: {
  //       phone,
  //     },
  //   });
  //   if (!user) {
  //     return {
  //       code: '100000',
  //       data: null,
  //       message: '用户名或密码错误',
  //     };
  //   }
  //   return {
  //     data: this.getToken(user),
  //   };
  // }

  async adminLogin(data: UserNameLoginDto) {
    const { name, password } = data;
    // const user = await this.userRepository.findOne({
    //   where: {
    //     phone,
    //   },
    // });

    if (!(name === 'admin' && password === 'admin')) {
      return {
        code: '100000',
        data: null,
        message: '用户名或密码错误',
      };
    }
    return {
      data: this.getToken({
        name: '管理员',
        id: 1,
        phone: '15927027721',
        password: 'admin',
        notes: '管理员',
        createdAt: '2020-12-12 12:12:12',
        updatedAt: '2020-12-12 12:12:12',
      }),
    };
  }
  async phonePasswordLogin(data: PhonePasswordLoginDto) {
    const { phone, password } = data;
    const user = await this.userRepository.findOne({
      where: {
        phone,
        password,
      },
    });

    if (!user) {
      return {
        code: '100000',
        data: null,
        message: '手机号不存在或密码错误',
      };
    }
    return {
      data: this.getToken(user),
    };
  }

  getToken(user: SystemUser) {
    const payload = {
      uid: user.id,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
