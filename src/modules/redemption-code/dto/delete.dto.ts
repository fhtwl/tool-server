import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteRedemptionCodeDto {
  @ApiProperty()
  @IsString()
  ids: string;
}
