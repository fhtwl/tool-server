import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class RedemptionCodeQueryDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
