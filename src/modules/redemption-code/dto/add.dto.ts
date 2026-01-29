import { OmitType } from '@nestjs/swagger';

import { RedemptionCode } from '../redemption-code.entity';

export class AddRedemptionCodeDto extends OmitType(RedemptionCode, [
  'createdAt',
  'updatedAt',
  'id',
]) {}

export type BatchAddRedemptionCodeDto = AddRedemptionCodeDto[];
