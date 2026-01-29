import {
  // ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import configuration from 'src/config/configuration';
// import { Socket } from 'dgram';

// 注意ws端口号不能和http端口号一样，否则会冲突
@WebSocketGateway(configuration().websocketPort)
export class WsGateway {
  async handleConnection(client: any, request: IncomingMessage) {
    console.log('ws connected', request.url);
  }
  // SubscribeMessage里面的字符串代表类型，就是send event的值
  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    // @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    console.log('ws hello data', data);
    const event = 'ws';
    return {
      event,
      data,
    };
  }

  @SubscribeMessage('message')
  handleChat(
    @MessageBody() data: string,
    // @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    console.log('ws hello data', data);
    const event = 'ws';
    return {
      event,
      data,
    };
  }
}
