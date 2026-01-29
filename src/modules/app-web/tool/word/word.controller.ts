import { Body, Controller, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppToolWordService } from './word.service';
import { ApiRes, ApiResType } from 'src/common/decorator/api-res.decorator';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from 'src/modules/system/common/upload/dto/file.dto';
import { UploadedFileRes } from 'src/modules/system/common/upload/interfaces/upload.interfaces';

@ApiTags('word模块')
@Controller('app/tool/word')
export class AppToolWordController {
  constructor(private readonly service: AppToolWordService,
  ) {}


  @ApiOperation({
    summary: '移除水印',
    description: '移除水印',
  })
  @Post('/remove-watermark')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 40 * 1024 * 1024, // 40MB
    }
  }))
  @ApiRes(UploadedFileRes)
  @Public()
  async removeWatermark(
    @UploadedFile() file: Express.Multer.File,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _data: UploadFileDto,) {
    const fullPath = await this.service.removeWatermark(file)  
    return {
      data: {
        path: fullPath,
        // originalName: file.originalname,
        name: file.filename,
        type: file.mimetype,
        size: file.size,
      },
    };
  }


}
