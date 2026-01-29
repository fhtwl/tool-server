import { OmitType } from '@nestjs/swagger';

import { Session } from '../session.entity';

export class AddSessionDto extends OmitType(Session, [
  'createdAt',
  'updatedAt',
  'id',
]) {}
