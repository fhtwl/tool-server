import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppFeedbackService } from './feedback.service';
import { FeedbackListDto } from './dto/list.dto';
// import { EditFeedbackDto } from './dto/edit.dto';
import { AddFeedbackDto } from './dto/add.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiRes, ApiResType } from 'src/common/decorator/api-res.decorator';
import { FeedbackQueryDto } from './dto/query.dto';
import { FeedbackModel } from './feedback.model';

@ApiTags('意见反馈模块')
@Controller('app/feedback')
export class AppFeedbackController {
  constructor(private readonly service: AppFeedbackService) {}

  @Post('/list')
  @ApiRes(FeedbackModel, ApiResType.PAGE_ARRAY)
  async findAll(@Body() params: FeedbackListDto) {
    return {
      data: await this.service.findAll(params),
    };
  }

  @Get('/query')
  @ApiRes(FeedbackModel)
  async query(@Query() params: FeedbackQueryDto) {
    return {
      data: await this.service.getDetail(params.id),
    };
  }

  // @Post('/edit')
  // @ApiRes(Feedback)
  // async edit(@Body() user: EditFeedbackDto) {
  //   return {
  //     data: await this.userService.update(user),
  //   };
  // }

  @Post('/add')
  @ApiRes()
  async add(@Body() user: AddFeedbackDto) {
    return {
      data: await this.service.create(user),
    };
  }
}
