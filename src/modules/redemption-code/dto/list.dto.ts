import { ApiProperty } from '@nestjs/swagger';
import { IsInt, ValidateNested } from 'class-validator';
import {
  RedemptionCodeStatus,
  RedemptionCodeType,
} from '../interfaces/redemption-code.interface';
import { Type } from 'class-transformer';

class RedemptionCodeListDtoParams {
  @ApiProperty({ required: false })
  code: string;

  @ApiProperty({ required: false })
  status: RedemptionCodeStatus;

  @ApiProperty({ required: false })
  type: RedemptionCodeType;
}

export class RedemptionCodeListDto {
  @ApiProperty()
  @IsInt()
  pageSize: number;

  @ApiProperty()
  @IsInt()
  pageNum: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => RedemptionCodeListDtoParams)
  params: RedemptionCodeListDtoParams;
}
