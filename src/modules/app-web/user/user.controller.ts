import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AppUserService } from './user.service';
import { AppUserListDto } from './dto/list.dto';
// import { EditDto } from './dto/edit.dto';
// import { EditInfoDto } from './dto/edit-info.dto';
// import { AddDto } from './dto/add.dto';
import { ApiTags } from '@nestjs/swagger';
import { AppUserQueryDto } from './dto/query.dto';
import { User } from './user.entity';
import { ApiRes, ApiResType } from 'src/common/decorator/api-res.decorator';
import { AppAuthService } from '../auth/auth.service';
import { AddAppUserDto } from './dto/add.dto';
import { EditAppUserDto } from './dto/edit.dto';
import { strToPinyinCode } from 'src/utils/pinyin.util';
import { DeleteAppUserDto } from './dto/delete.dto';
import { Public } from 'src/common/decorator/public.decorator';
// import { AppAuthService } from '../auth/auth.service';

@ApiTags('app用户管理模块')
@Controller('app/user')
export class AppUserController {
  constructor(
    private readonly userService: AppUserService,
    private readonly appAuthService: AppAuthService,
  ) {}

  @Post('/list')
  @ApiRes(User, ApiResType.PAGE_ARRAY)
  async findAll(@Body() params: AppUserListDto) {
    return {
      data: await this.userService.findAll(params),
    };
  }

  @Get('/query')
  @ApiRes(User)
  async query(@Query() params: AppUserQueryDto) {
    return {
      data: await this.userService.getUserDetail(params.id),
    };
  }

  @Get('/userInfo')
  async userInfo(@Req() request) {
    const { uid } = request.auth;
    return {
      data: await this.userService.getUserDetail(uid),
    };
  }

  @Post('/edit')
  async edit(@Body() user: EditAppUserDto) {
    user.initial = strToPinyinCode(user.name);
    return {
      data: await this.userService.update(user),
    };
  }

  // @Post('/editInfo')
  // async editInfo(@Req() request, @Body() user: EditInfoDto) {
  //   const { uid } = request.auth;
  //   return {
  //     data: await this.userService.updateInfo(uid, user),
  //   };
  // }

  @Post('/add')
  async add(@Body() user: AddAppUserDto) {
    user.initial = strToPinyinCode(user.name);
    return {
      data: await this.userService.createUser(user),
    };
  }

  @Get('/delete')
  @ApiRes()
  async deleteByIds(@Query() params: DeleteAppUserDto) {
    const idsList = params.ids.split(',').map((id) => Number(id));
    return {
      data: await this.userService.remove(idsList),
    };
  }

  @Get('/resetToken')
  async resetToken(@Req() request) {
    const { uid } = request.auth;
    return {
      data: {
        token: this.appAuthService.getToken({ id: uid } as User),
      },
    };
  }
}
