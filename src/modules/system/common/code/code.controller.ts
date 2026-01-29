import {
  Controller,
  Get,
  StreamableFile,
  Response,
  Session,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Public } from 'src/common/decorator/public.decorator';
import * as svgCaptcha from 'svg-captcha';

@Controller('common/code')
export class CodeController {
  @Get('/img')
  @Public()
  getCode(@Session() session: Record<string, any>) {
    const captcha: svgCaptcha.CaptchaObj = svgCaptcha.createMathExpr({
      size: 6, //验证码长度
      fontSize: 45, //验证码字号
      ignoreChars: '0o1i', // 过滤掉某些字符， 如 0o1i
      noise: 1, //干扰线条数目
      width: 100, //宽度
      // heigth:40,//高度
      color: true, //验证码字符是否有颜色，默认是没有，但是如果设置了背景颜色，那么默认就是有字符颜色
      background: '#cc9966', //背景大小
    });
    console.log('captcha.text', captcha.text);
    // return captcha.text;
    session.code = captcha.text;
    return captcha.data;
    // return new StreamableFile(captcha.data);
  }

  @Get('/phone')
  @Public()
  getPhoneCode(@Session() session: Record<string, any>) {
    session.code = '666666';
    return {
      data: session.code,
    };
    // return new StreamableFile(captcha.data);
  }

  @Get('/json')
  getVersion(@Response({ passthrough: true }) res): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    res.set({
      'Content-Disposition': 'attachment; filename=package.json',
    });
    return new StreamableFile(file);
  }
}
