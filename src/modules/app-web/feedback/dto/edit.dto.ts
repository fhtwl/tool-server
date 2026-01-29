import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { AddFeedbackDto } from './add.dto';

export class EditFeedbackDto extends AddFeedbackDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
