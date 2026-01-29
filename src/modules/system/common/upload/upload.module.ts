import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import configuration from 'src/config/configuration';
const { dirPath, dirPrefix } = configuration().upload;

@Module({
  imports: [
    MulterModule.register({
      // dest: './uploads',
      storage: diskStorage({
        destination: `${dirPath}${dirPrefix}`, // 上传文件目录
        filename: (req, file, cb) => {
          // 生成文件名
          const filename = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}.${file.originalname.split('.').pop()}`;

          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 可以在这里重新指定文件大小限制
      },
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
})
export default class UploadModule {}
