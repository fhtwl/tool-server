import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, ValidateNested } from 'class-validator';
// import { PagingDto } from 'src/common/dto/paging.dto';

class FeedbackListDtoParams {
  @ApiProperty({ required: false })
  contact: string;
}

export class FeedbackListDto {
  @ApiProperty()
  @IsInt()
  pageSize: number;

  @ApiProperty()
  @IsInt()
  pageNum: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => FeedbackListDtoParams)
  params: FeedbackListDtoParams;
}
