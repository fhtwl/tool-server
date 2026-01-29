import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserNameLoginDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class PhoneCodeLoginDto {
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  code: string;
}

export class PhonePasswordLoginDto {
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;
}
