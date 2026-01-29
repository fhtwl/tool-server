import { OmitType } from '@nestjs/swagger';

import { Feedback } from '../feedback.entity';

export class AddFeedbackDto extends OmitType(Feedback, [
  'createdAt',
  'updatedAt',
  'id',
]) {
  // @IsString()
  // title: string;
  // @IsString()
  // content: string;
  // @IsString()
  // imgs: string;
}
