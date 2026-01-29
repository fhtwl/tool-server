import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RedemptionCodeListDto } from './dto/list.dto';
import { RedemptionCodeService } from './redemption-code.service';

import { AddRedemptionCodeDto, BatchAddRedemptionCodeDto } from './dto/add.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  EditRedemptionCodeDto,
  ExChangeRedemptionCodeDto,
} from './dto/edit.dto';
import { ApiRes, ApiResType } from 'src/common/decorator/api-res.decorator';
import { RedemptionCode } from './redemption-code.entity';
import { RedemptionCodeQueryDto } from './dto/query.dto';
import { DeleteRedemptionCodeDto } from './dto/delete.dto';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('激活码模块')
@Controller('redemptionCode')
@UseInterceptors(LoggingInterceptor)
export default class RedemptionCodeController {
  constructor(
    private readonly redemptionCodeService: RedemptionCodeService,

    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Post('/list')
  @ApiRes(RedemptionCode, ApiResType.PAGE_ARRAY)
  async list(@Body() params: RedemptionCodeListDto) {
    return {
      data: await this.redemptionCodeService.findAll(params),
    };
  }

  @Get('/query')
  @ApiRes(RedemptionCode)
  async query(@Query() params: RedemptionCodeQueryDto) {
    return {
      data: await this.redemptionCodeService.getUserDetail(params.id),
    };
  }

  @Get('/delete')
  @ApiRes()
  async remove(@Query() params: DeleteRedemptionCodeDto) {
    const idsList = params.ids.split(',').map((id) => Number(id));
    return {
      data: await this.redemptionCodeService.remove(idsList),
    };
  }

  @Post('/edit')
  @ApiRes()
  async edit(@Body() user: EditRedemptionCodeDto) {
    return {
      data: await this.redemptionCodeService.update(user),
    };
  }

  @Post('/exChange')
  @ApiRes()
  @Public()
  async exChange(@Body() data: ExChangeRedemptionCodeDto) {
    return {
      data: await this.redemptionCodeService.exChange(data),
    };
  }

  @Post('/add')
  @ApiRes()
  async add(@Body() data: AddRedemptionCodeDto) {
    return {
      data: await this.redemptionCodeService.add(data),
    };
  }

  @Post('/batchAdd')
  @ApiRes()
  async batchAdd(@Body() datas: BatchAddRedemptionCodeDto) {
    try {
      await this.redemptionCodeService.batchAdd(datas);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return {
          message: '激活码已存在',
          code: '100000',
        };
        // throw new E
      }
      return {
        msg: '添加失败',
        code: '100000',
      };
    }
    return {};
  }

  @Post('/batchEdit')
  @ApiRes()
  async batchEdit(@Body() datas: BatchAddRedemptionCodeDto) {
    return {
      data: await this.redemptionCodeService.batchEdit(datas),
    };
  }
}
