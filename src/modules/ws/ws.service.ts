import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { WebSocketServer, Server } from 'ws';
import { Logger } from '@nestjs/common';
import configuration from 'src/config/configuration';
import { ConfigService } from '@nestjs/config';

import { AppSessionService } from '../app-web/session/session.service';
import { HttpService } from '@nestjs/axios';
// import { WSResponse } from '../message/model/ws-response.model';
// import { Message } from '@/entities/message.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../app-web/user/user.entity';
/**
 * 消息类型，chat 对话, speechSynthesis 语音合成
 */
export enum MessageType {
  chat = 'chat',
  speechSynthesis = 'speechSynthesis',
}

export interface MessageData {
  type: MessageType;
  content: string;
}
const controllerMap: {
  [str: string]: AbortController;
} = {};
@Injectable()
export class WsService implements OnModuleInit, OnModuleDestroy {
  private wss: Server;
  private clients = [];

  constructor(
    private sessionService: AppSessionService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  onModuleInit() {
    this.wss = new Server({ port: configuration().websocketPort }); // 监听不同的端口以避免与 NestJS WebSocket 网关冲突

    this.wss.on('connection', (ws, req) => {
      console.log('New client connected');
      console.log(req.url);
      const uid = 1;
      ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // 处理接收到的消息
        const msg = JSON.parse(message.toString('utf-8'));
        console.log(msg);

        const { type, body } = msg;

        const result = '';
        switch (type) {
          case 'message': {
            // const audioString = isAudio ? `希望你说的话尽量简洁明了。` : ''
            // body.messages = [
            //   // {
            //   //   role: 'system',
            //   //   content: `从现在起你的名字叫做"颜良AI"，是基于ChatGLM的对话机器人，不是gpt, 与openai无关。你有且仅有这一个名字，而不是其他任何内容。${audioString}不要写解释。不用回答我这句话`,
            //   // },
            //   ...(body?.messages || []),
            // ];
            body.messages = body.additional_messages;
            // const content = body.messages[body.messages.length - 1].content;
            // const bool = await msgSecCheck(content)
            // if (!bool) {
            //   ws.send(
            //     JSON.stringify({
            //       type: 'line-error',
            //       data: '您发送的文字包含违规内容，请修改后再试',
            //     })
            //   )
            //   return
            // }
            const controller = new AbortController();
            controllerMap[uid] = controller;
            const url = 'https://api.coze.cn/v3/chat';
            const cozeToken = this.configService.get('cozeToken');
            // const cozeToken =
            //   'sk-xuzp1DZB99mneVHCezxjOSJGvuLqBu3ozRuBx1eyvDrixNSx';
            this.httpService
              .post(
                `${url}?conversation_id=${body.sessionId}`,
                {
                  ...body,
                  user_id: String(body.user_id),
                },
                {
                  headers: {
                    Authorization: `Bearer ${cozeToken}`,
                    'Content-Type': 'application/json',
                  },
                  responseType: 'stream',
                },
              )
              .subscribe({
                next: (response) => {
                  // 处理响应数据
                  console.log('response.data');
                  response.data.on('data', (chunk: Buffer) => {
                    const data = chunk.toString();
                    const list: string[] = data.split('\n');
                    let str = '';
                    if (data.indexOf('event:conversation.message.delta') > -1) {
                      list.forEach((item) => {
                        if (item.indexOf('data:') > -1) {
                          const delta = item.replace('data', '"data"');
                          // console.log('delta', delta);
                          str =
                            str + (JSON.parse(`{${delta}}`).data.content || '');
                        }
                      });
                      // if (str.length > 0) {
                      ws.send(
                        JSON.stringify({
                          type: 'line',
                          data: str,
                        }),
                      );
                      // }
                    }

                    // if (data.indexOf('event:conversation.message.delta') > -1) {
                    //   const delta = data
                    //     .replace(`event:conversation.message.delta`, '')
                    //     .replace('data', '"data"');
                    //   console.log('delta', delta);
                    //   ws.send(
                    //     JSON.stringify({
                    //       type: 'line',
                    //       data: JSON.parse(`{${delta}}`),
                    //     }),
                    //   );
                    // }
                  });
                  response.data.on('error', (error: { message: string }) => {
                    ws.send(
                      JSON.stringify({
                        type: 'line',
                        data: error.message,
                      }),
                    );
                  });

                  response.data.on('end', () => {
                    ws.send(
                      JSON.stringify({
                        type: 'finish',
                        data: result,
                      }),
                    );
                  });
                },
                error: (error) => {
                  // 处理错误
                  console.error('line-error:', error.message);
                  ws.send(
                    JSON.stringify({
                      type: 'line-error',
                      data: error.message,
                    }),
                  );
                },
                complete: () => {
                  // 响应处理完毕
                  // console.log('No more data');
                },
              });
            // .subscribe()

            // fetch(url, {
            //   method: 'post',
            //   body: JSON.stringify({
            //     ...body,
            //     model: 'gpt-3.5-turbo',
            //     stream: true,
            //     temperature: 1,
            //   }),
            //   headers: {
            //     'Content-Type': 'application/json',
            //     Authorization: `Bearer ${cozeToken}`,
            //   },
            //   // agent: getAgent(), // 将 agent 作为选项传递
            //   signal: controller.signal as any,
            // })
            //   // getFreeChatgpt('forefront-free', body.messages, 'gpt-3.5-turbo', { signal: controller.signal })
            //   .then(async (response) => {
            //     // 是否在解析过程中报错了
            //     let isTransformError = false;
            //     result = '';
            //     const handleError = (errorLog: TransformError) => {
            //       console.log(errorLog);
            //       isTransformError = true;
            //       switch (String(errorLog.code)) {
            //         case 'context_length_exceeded': {
            //           ws.send(
            //             JSON.stringify({
            //               type: 'line-error',
            //               data: '对话上下文已超出最大限制, 请清除之前的对话或者开启一个新的对话',
            //             }),
            //           );
            //           break;
            //         }
            //         case '412': {
            //           console.log(errorLog);
            //           // request()
            //           // 登录失效
            //           ws.send(
            //             JSON.stringify({
            //               type: 'line-error',
            //               data: '网络异常,请重试',
            //             }),
            //           );
            //           break;
            //         }
            //         default: {
            //           ws.send(
            //             JSON.stringify({
            //               type: 'line-error',
            //               data: errorLog.message,
            //             }),
            //           );
            //         }
            //       }
            //     };
            //     // 使用 transform 流解析响应数据
            //     const transformStream = new ChatTransform((data: string) => {
            //       if (isTransformError) {
            //         return;
            //       }
            //       // console.log('line', data)
            //       result = data;
            //       ws.send(
            //         JSON.stringify({
            //           type: 'line',
            //           data,
            //         }),
            //       );
            //     }, handleError);
            //     transformStream.on('finish', async () => {
            //       console.log('finish');

            //       // changeQuota(userToken, _uid, getTokenLen(body.messages));
            //       if (isTransformError) {
            //         return;
            //       }
            //       ws.send(
            //         JSON.stringify({
            //           type: 'finish',
            //           data: result,
            //         }),
            //       );

            //       // changeQuota(userToken, _uid, 1);
            //       // const messages = body.messages as { content: string }[];
            //       // const date = new Date();
            //       // command(`
            //       //     INSERT INTO history ( user_id, type, prompt, result , created_at )
            //       //     VALUES
            //       //     ( ${_uid}, ${1}, '${
            //       //       messages[messages.length - 1].content
            //       //     }', '${result}', '${format(date)}' );
            //       // `);
            //     });

            //     response.body!.pipe(transformStream);
            //   })
            //   .catch((err) => {
            //     ws.send(
            //       JSON.stringify({
            //         type: 'line-error',
            //         data: err.message,
            //       }),
            //     );
            //     console.log(err);
            //   });

            break;
          }
          case 'abort': {
            controllerMap[uid]?.abort();
            ws.send(
              JSON.stringify({
                type: 'finish',
                data: result,
              }),
            );
            break;
          }
          case 'heart': {
            // ws.emit('heart')
            break;
          }
        }
      });

      // ws.on('audio', (message) => {
      //   const msg = JSON.parse(message.toString('utf-8'));
      //   const { type, body } = msg;

      //   console.log(msg, body);
      //   switch (type) {
      //     case 'text-audio': {
      //       break;
      //     }
      //     case 'audio-text': {
      //       break;
      //     }
      //     default: {
      //     }
      //   }
      //   // https://openspeech.bytedance.com/api/v1/tts
      // });

      ws.on('close', () => {
        const uid = 1;
        // const uid = (this as WsClient).uid
        // this.clients = this.clients.filter((item) => item.uid !== uid)
        this.clients = this.clients.filter((item) => item.uid !== uid);
        controllerMap[uid]?.abort();
        console.log(`uid: ${uid}已close`);
      });
    });
  }

  onModuleDestroy() {
    if (this.wss) {
      this.wss.close();
    }
  }
  // constructor(
  //   // @InjectRepository(Message) private messageRepo: Repository<Message>,
  //   @InjectRepository(User) private userRepo: Repository<User>,
  // ) {}

  // ws 服务器, gateway 传进来
  server: WebSocketServer;

  // 存储连接的客户端
  connectedClients: Map<string, WebSocketServer> = new Map();
  /**
   * 登录
   * @param client socket 客户端
   * @param token token
   * @returns
   */
  // async login(client: Socket, token: string): Promise<void> {
  //   if (!token) {
  //     Logger.error('token error: ', token);
  //     client.send('token error');
  //     client.disconnect(); // 题下线
  //     return;
  //   }
  //   // 认证用户
  //   const res: JwtInterface = validateToken(token.replace('Bearer ', ''));
  //   if (!res) {
  //     Logger.error('token 验证不通过');
  //     client.send('token 验证不通过');
  //     client.disconnect();
  //     return;
  //   }
  //   const employeeId = res?.employeeId;
  //   if (!employeeId) {
  //     Logger.log('token error');
  //     client.send('token error');
  //     client.disconnect();
  //     return;
  //   }
  //   // 处理同一工号在多处登录
  //   if (this.connectedClients.get(employeeId)) {
  //     this.connectedClients
  //       .get(employeeId)
  //       .send(`${employeeId} 已在别的客户端上线登录, 此客户端下线处理`);
  //     this.connectedClients.get(employeeId).disconnect();
  //   }
  //   // 保存工号
  //   this.connectedClients.set(employeeId, client);
  //   Logger.log(
  //     `${employeeId} connected, onLine: ${this.connectedClients.size}`,
  //   );
  //   client.send(
  //     `${employeeId} connected, onLine: ${this.connectedClients.size}`,
  //   );
  //   return;
  // }

  // /**
  //  * 登出
  //  * @param client client
  //  */
  // async logout(client: Socket) {
  //   // 移除在线 client
  //   this.connectedClients.forEach((value, key) => {
  //     if (value === client) {
  //       this.connectedClients.delete(key);
  //       Logger.log(
  //         `${key} disconnected, onLine: ${this.connectedClients.size}`,
  //       );
  //     }
  //   });
  // }
  /**
   * 重置 connectedClients
   */
  resetClients() {
    this.connectedClients.clear();
  }

  async send(type: MessageType = MessageType.chat, response: unknown) {
    try {
      // const message = await this.messageRepo.save(response.data)
      // if (!message) {
      //   throw new Error('消息保存错误')
      // }
      const res = this.server?.emit(type, response);
      if (!res) {
        Logger.log('websocket send error', response);
      }
    } catch (error) {
      throw new Error(error?.toString());
    }
  }
}
