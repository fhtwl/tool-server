import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, ValidateNested } from 'class-validator';

export class SystemUserListDtoParams {
  @ApiProperty({ required: false })
  name: string;
}

export class SystemUserListDto {
  @ApiProperty()
  @IsInt()
  pageSize: number;

  @ApiProperty()
  @IsInt()
  pageNum: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SystemUserListDtoParams)
  params: SystemUserListDtoParams;
}
