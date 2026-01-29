import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { SystemUserListDto } from './dto/list.dto';
import { EditSystemUserDto } from './dto/edit.dto';
import { AddSystemUserDto } from './dto/add.dto';
import { ApiRes, ApiResType } from 'src/common/decorator/api-res.decorator';
import { SystemUser } from './user.entity';

@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/list')
  @ApiRes(SystemUser, ApiResType.PAGE_ARRAY)
  async findAll(@Body() params: SystemUserListDto) {
    return {
      data: await this.userService.findAll(params),
    };
  }

  @Get('/query')
  async query() {
    // const { uid } = request.auth;
    return {
      // data: await this.userService.getUserDetail(uid),
      data: {
        name: '管理员',
        phone: '',
      },
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
  async edit(@Body() user: EditSystemUserDto) {
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

  @Post('/getUserMenu')
  async getUserMenu() {
    // const { scope } = request.auth;
    return {
      data: [],
      // data: await this.userService.getUserMenu(scope),
    };
  }

  @Post('/add')
  async add(@Body() user: AddSystemUserDto) {
    return {
      data: await this.userService.createUser(user),
    };
  }
}
