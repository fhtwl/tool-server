import { Body, Controller, Post } from '@nestjs/common';
import { AppAuthService } from './auth.service';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiStringRes } from 'src/common/decorator/api-res.decorator';
import { EmailLoginDto } from './dto/login.dot';

@ApiTags('小程序登录模块')
@Controller('/app/auth')
export default class AppAuthController {
  constructor(private readonly authService: AppAuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: '登录',
  })
  @ApiStringRes()
  @Public()
  login(@Body() emailPasswordLoginDto: EmailLoginDto) {
    return this.authService.emailPasswordLogin(emailPasswordLoginDto);
  }
}
