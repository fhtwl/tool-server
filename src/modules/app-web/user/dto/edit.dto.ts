import { OmitType } from '@nestjs/swagger';

import { User } from '../user.entity';

export class EditAppUserDto extends OmitType(User, [
  'createdAt',
  'updatedAt',
]) {}
