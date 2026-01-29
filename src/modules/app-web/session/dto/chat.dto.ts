import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

// class ImageUrl {
//   @ApiProperty()
//   @IsInt()
//   url: string;
// }

// class MessageContent {
//   @ApiProperty({
//     description: `类型, 'image_url' | 'text'`,
//   })
//   @IsString()
//   type: 'image_url' | 'text';

//   @ApiProperty({ required: false })
//   image_url: ImageUrl;

//   @ApiProperty({ required: false })
//   text?: string;
// }

export class ChatDto {

  @ApiProperty({ description: '用户输入内容' })
  content: any;

}

export class ChatResItemDto {
  @ApiProperty({ description: 'id' })
  @IsString()
  id: string;

  @ApiProperty({ description: '类型, 1-message | 2-report' })
  @IsInt()
  type: string;

  // @ApiProperty({ description: '会话id' })
  // @IsInt()
  // sessionId: number;

  @ApiProperty({ description: '角色，user | assistant' })
  @IsString()
  role: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  content: string;
}

export class TipChatDto {
  @ApiProperty({ description: '会话id' })
  @IsInt()
  id: number;
}

export class TipChatResDto {
  @ApiProperty({ description: '提示句子' })
  @IsString()
  content: string;
}

export class HelloChatDto {
  @ApiProperty({ description: '会话id' })
  @IsInt()
  id: number;

  @ApiProperty({ description: '场景id' })
  @IsInt()
  sceneId: number;

  @ApiProperty({ description: '人物id，1-晓晓', default: 1 })
  @IsInt()
  botId: number;

  @ApiProperty({ description: '场景名称' })
  @IsString()
  sceneName: string;

  @ApiProperty({ description: '场景介绍', required: false })
  sceneIntro?: string;

  @ApiProperty({ description: '学习水平, 1-初级;2-中级;3-高级' })
  @IsInt()
  level: number;
}
