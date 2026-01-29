import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteAppUserDto {
  @ApiProperty()
  @IsString()
  ids: string;
}
