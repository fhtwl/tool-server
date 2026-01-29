import { OmitType } from '@nestjs/swagger';
import { SystemUser } from '../user.entity';

export class AddSystemUserDto extends OmitType(SystemUser, [
  'createdAt',
  'updatedAt',
  'id',
]) {}
