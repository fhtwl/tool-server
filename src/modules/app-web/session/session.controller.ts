import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppSessionService } from './session.service';
import { AddSessionDto } from './dto/add.dto';
import { ApiRes, ApiResType } from 'src/common/decorator/api-res.decorator';
import { ChatDto, ChatResItemDto } from './dto/chat.dto';
import { Response } from 'express';
import { GptService } from './gpt.service';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('会话模块')
@Controller('app/session')
export class AppSessionController {
  constructor(private readonly service: AppSessionService,
    private readonly gptService: GptService
  ) {}

  @Post('/add')
  async add(@Body() session: AddSessionDto) {
    return {
      data: await this.service.post('/v1/conversation/create', session),
    };
  }




  @ApiOperation({
    summary: '生成图片',
    description: '语音和视频对话, 返回json',
  })
  @Post('/create-image-stream')
  @Public()
  async createImageStream(@Body() chatDto: ChatDto,@Res() res: Response) {
    // 设置HTTP头以支持SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
      
    const {
      content,
    } = chatDto;

    // 清理: 当请求关闭时停止发送事件
    res.on('close', () => {
      res.end();
    });
    res.write(' ');
    let timer = setInterval(() =>{
      res.write(' ');
    },5000)
    const data = await this.gptService.post({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `请将我提供的照片转换为一张现代高清的吉卜力动画风格插画，保留照片的基本构图与主体元素。
具体要求如下：
使用细腻、干净、明亮的手绘风格进行重绘。
构图不变：人物和背景的布局与原图保持一致。
人物主体保留：保留人物表情和动作，表现出自然、富有情感的状态。
色彩处理：色彩鲜明自然，避免泛黄或昏暗，整体氛围应温柔、通透、有情感张力。
线条风格：线条清晰流畅，细节丰富，具有手绘质感。
尺寸比例：输出图像尺寸与原图一致。`,
        },
        {
          role: 'user',
          content,
        },
      ],
    });
    clearInterval(timer)
    try {
      res.write(JSON.stringify(data));
      // res.write('data');
      res.end();
    }
    catch (e) {
      res.status(500).end();
    }
    // return {
    //   data: messageList,
    // };
    return 
  }


  @ApiOperation({
    summary: '生成图片',
    description: '语音和视频对话, 返回json',
  })
  @Post('/create-image')
  @Public()
  @ApiRes(ChatResItemDto)
  async createImage(@Body() chatDto: ChatDto,) {
    const {
      content,
    } = chatDto;

    const data = await this.gptService.post({
      model: 'gpt-4o-image',
      messages: [
        {
          role: 'system',
          content: `请将我提供的照片转换为一张现代高清的吉卜力动画风格插画，保留照片的基本构图与主体元素。
具体要求如下：
使用细腻、干净、明亮的手绘风格进行重绘。
构图不变：人物和背景的布局与原图保持一致。
人物主体保留：保留人物表情和动作，表现出自然、富有情感的状态。
色彩处理：色彩鲜明自然，避免泛黄或昏暗，整体氛围应温柔、通透、有情感张力。
线条风格：线条清晰流畅，细节丰富，具有手绘质感。
尺寸比例：输出图像尺寸与原图一致。`,
        },
        {
          role: 'user',
          content,
        },
      ],
    });
    
    return {
      data,
    };
  }

  @ApiOperation({
    summary: '生成图片',
    description: '语音和视频对话, 返回json',
  })
  @Post('/images-generations')
  @Public()
  @ApiRes(ChatResItemDto)
  async imagesGenerations(@Body() chatDto: ChatDto,) {
    const {
      content,
    } = chatDto;

    const data = await this.gptService.post({
      model: 'flux-1-dev',
      messages: [
        {
          role: 'system',
          content: `请将我提供的照片转换为一张现代高清的吉卜力动画风格插画，保留照片的基本构图与主体元素。
具体要求如下：
使用细腻、干净、明亮的手绘风格进行重绘。
构图不变：人物和背景的布局与原图保持一致。
人物主体保留：保留人物表情和动作，表现出自然、富有情感的状态。
色彩处理：色彩鲜明自然，避免泛黄或昏暗，整体氛围应温柔、通透、有情感张力。
线条风格：线条清晰流畅，细节丰富，具有手绘质感。
尺寸比例：输出图像尺寸与原图一致。`,
        },
        {
          role: 'user',
          content,
        },
      ],
    });
    // 将当前图像转换为《千与千寻》时期吉卜力高清动画风格，保留原始构图中人物与背景的黄金分割比例。使用赛璐珞手绘质感，线条宽度0.1-0.3mm动态变化，色相严格匹配油屋黄昏色谱（参考HSB 28°,65%,82%到35°,78%,90%渐变）。对水面倒影进行流体力学模拟，但千寻式瞳孔高光需强化150%情感表现力。确保无任何现存吉卜力IP元素的直接复现。
    
    return {
      data,
    };
  }
}
