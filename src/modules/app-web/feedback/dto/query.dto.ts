import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class FeedbackQueryDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
