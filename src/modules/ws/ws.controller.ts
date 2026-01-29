import { Controller, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { Public } from 'src/common/decorator/public.decorator';
import { WsService } from './ws.service';
import { ApiRes } from 'src/common/decorator/api-res.decorator';

@Public()
@ApiTags('ws模块')
@Controller('ws')
export class WsController {
  constructor(private readonly service: WsService) {}

  @Get('/get')
  @ApiRes()
  async query() {
    return {
      data: 1,
    };
  }
}
