import { Body, Controller, Post } from '@nestjs/common';
import { PhonePasswordLoginDto, UserNameLoginDto } from './dto/login.dot';
import { AuthService } from './auth.service';
// import { CheckSession } from 'src/common/decorator/check-session.decorator';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('/system/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @Public()
  // @CheckSession('code')
  login(@Body() userNameLoginDto: UserNameLoginDto) {
    console.log(userNameLoginDto);
    return this.authService.adminLogin(userNameLoginDto);
  }

  @Post('/appLogin')
  @Public()
  // @CheckSession('code')
  appLogin(@Body() userNameLoginDto: PhonePasswordLoginDto) {
    console.log(userNameLoginDto);
    return this.authService.phonePasswordLogin(userNameLoginDto);
  }

  // @Post('/login')
  // @Public()
  // @CheckSession('code')
  // login(@Body() userNameLoginDto: PhoneCodeLoginDto) {
  //   console.log(userNameLoginDto);
  //   return this.authService.phoneCodeLogin(userNameLoginDto);
  // }
}
