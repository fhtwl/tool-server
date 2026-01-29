import { OmitType } from '@nestjs/swagger';

import { SystemUser } from '../user.entity';

export class EditSystemUserDto extends OmitType(SystemUser, [
  'createdAt',
  'updatedAt',
]) {}
