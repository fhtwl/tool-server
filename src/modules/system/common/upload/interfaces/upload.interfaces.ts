import { ApiProperty } from '@nestjs/swagger';

// 定义文件类型
export class UploadedFileRes {
  @ApiProperty({ description: '文件名' })
  name: string;

  @ApiProperty({ description: '文件类型' })
  type: string;

  @ApiProperty({ description: '文件路径' })
  path: string;

  @ApiProperty({ description: '文件大小' })
  size: number;
}
