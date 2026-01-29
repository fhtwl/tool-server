import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

// 分页
export class PagingDto<T = unknown> {
  @ApiProperty()
  @IsInt()
  pageSize: number;

  @ApiProperty()
  @IsInt()
  pageNum: number;

  @ApiProperty()
  params: T;
}

export class ResponseDto<T> {
  @ApiProperty({ description: '状态码' })
  code: string;
  @ApiProperty({ description: '消息' })
  msg: string;
  @ApiProperty()
  data: T;
}

export class PagingResponse<T> {
  @ApiProperty({ description: '每页条数' })
  @IsInt()
  pageSize: number;

  @ApiProperty({ description: '总条数' })
  @IsInt()
  total: number;

  @ApiProperty({ description: '当前页' })
  @IsInt()
  current: number;

  @ApiProperty({ description: '总页数' })
  @IsInt()
  pages: number;

  @ApiProperty()
  records: T[];
}

export class PagingResponseDto<T> {
  @ApiProperty({ description: '状态码' })
  code: string;

  @ApiProperty({ description: '消息' })
  msg: string;

  @ApiProperty()
  data: PagingResponse<T>;
}

// export class PagingDto {
//   @ApiProperty()
//   @IsInt()
//   pageSize: number;

//   @ApiProperty()
//   @IsInt()
//   pageNum: number;

//   @ApiProperty()
//   params: T;
// }
