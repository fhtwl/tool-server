import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { AddRedemptionCodeDto } from './add.dto';

export class EditRedemptionCodeDto extends AddRedemptionCodeDto {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class ExChangeRedemptionCodeDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  studentId: string;
}
