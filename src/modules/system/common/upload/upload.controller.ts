import {
  Controller,
  // UploadedFile,
  UseInterceptors,
  Post,
  // UploadedFiles,
  UploadedFile,
  Body,
} from '@nestjs/common';
import {
  FileInterceptor,
  // AnyFilesInterceptor,
  // FileFieldsInterceptor,
  // FileInterceptor,
  // FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UploadFileDto } from './dto/file.dto';
import { ApiRes } from 'src/common/decorator/api-res.decorator';
import { UploadedFileRes } from './interfaces/upload.interfaces';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('公共文件上传模块')
@ApiBearerAuth()
@Controller('common/upload')
export class UploadController {
  constructor(private readonly configService: ConfigService) {}

  // 单文件上传
  @ApiOperation({
    summary: '上传文件',
  })
  @Post('/file')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiRes(UploadedFileRes)
  @Public()
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _data: UploadFileDto,
  ) {
    // console.log(file, data);
    const { dirPrefix } = this.configService.get('upload');
    return {
      data: {
        path: `${dirPrefix}/${file.filename}`,
        // originalName: file.originalname,
        name: file.filename,
        type: file.mimetype,
        size: file.size,
      },
    };
  }

  // // 单图片上传
  // @Post('/img')
  // @UseInterceptors(FileInterceptor('img'))
  // uploadImg(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }

  // 文件数组上传
  // @Post('/fileList')
  // @Post('upload')
  // @UseInterceptors(FilesInterceptor('files'))
  // uploadFileList(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   console.log(files);
  // }

  // // 上传多个文件（全部使用不同的键）
  // @Post('/files')
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: 'avatar', maxCount: 1 },
  //     { name: 'background', maxCount: 1 },
  //   ]),
  // )
  // uploadFiles(
  //   @UploadedFiles()
  //   files: {
  //     avatar?: Express.Multer.File[];
  //     background?: Express.Multer.File[];
  //   },
  // ) {
  //   console.log(files);
  // }

  // // 使用任意字段名称键上载所有字段
  // @Post('/allFiles')
  // @UseInterceptors(AnyFilesInterceptor())
  // uploadAllFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   console.log(files);
  // }
}
