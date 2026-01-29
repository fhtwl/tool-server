import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class EditAppUserInfoDto {
  @ApiProperty()
  @IsString()
  @Length(2, 255)
  nickName: string;

  @ApiProperty()
  @IsString()
  @Length(0, 255)
  profile: string;

  @ApiProperty()
  @IsString()
  avatar: string;
}
