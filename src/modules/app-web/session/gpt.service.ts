import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { finalize, firstValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
// import { PassThrough } from 'stream';
@Injectable()
export class GptService {
  private access_token: string;
  private expires_in: number;
  private timestamp: number;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}


  public async post<T, R>(data: T): Promise<R> {
    try {
      const OPENAI_API_KEY = this.configService.get('OPENAI_API_KEY');
      const OPENAI_API_URL = this.configService.get('OPENAI_API_URL');
      const response = await firstValueFrom(
        this.httpService.post(
          // `https://openrouter.ai/api/v1/chat/completions`,
          `${OPENAI_API_URL}/v1/chat/completions`,
          {
            ...data,
            stream: false,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
          },
        ),
      );

      // 检查响应状态码和自定义的code字段
      if (response.status !== 200 || !response.data) {
        console.log(`ai 错误 ${response.data.msg}`);
        throw new HttpException(
          `${response.data.msg || 'Unknown error'}`,
          HttpStatus.INTERNAL_SERVER_ERROR, // 根据实际情况调整状态码
        );
      }
      try {
        return response.data.choices[0]?.message?.content ;
      } catch (error) {
        console.log(`ai 错误 ${error} ${JSON.stringify(response.data)}`);
        return null;
      }
    } catch (error) {
      // 处理请求过程中的错误（如网络问题）
      throw error;
    }
  }

  public async imagesGenerations<T, R>(prompt: string): Promise<R> {
    try {
      const OPENAI_API_KEY = this.configService.get('OPENAI_API_KEY');
      const OPENAI_API_URL = this.configService.get('OPENAI_API_URL');
      const response = await firstValueFrom(
        this.httpService.post(
          // `https://openrouter.ai/api/v1/chat/completions`,
          `${OPENAI_API_URL}/v1/images/generations`,
          {
            prompt,
            "model": "flux-1-dev",
            "size": "1440x1440"
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
          },
        ),
      );

      // 检查响应状态码和自定义的code字段
      if (response.status !== 200 || !response.data) {
        console.log(`ai 错误 ${response.data.msg}`);
        throw new HttpException(
          `${response.data.msg || 'Unknown error'}`,
          HttpStatus.INTERNAL_SERVER_ERROR, // 根据实际情况调整状态码
        );
      }
      try {
        return response.data.choices[0]?.message?.content ;
      } catch (error) {
        console.log(`ai 错误 ${error} ${JSON.stringify(response.data)}`);
        return null;
      }
    } catch (error) {
      // 处理请求过程中的错误（如网络问题）
      throw error;
    }
  }

  public async chat<T>(data: T): Promise<string> {
    // const xiaoe = this.configService.get('xiaoe');
    try {
      // const access_token = await this.getToken();
      // if (typeof data === 'object') {
      //   (data as Common.Params).access_token = access_token;
      // }
      const OPENAI_API_KEY = this.configService.get('OPENAI_API_KEY');
      const response = await firstValueFrom(
        this.httpService.post(
          // `https://openrouter.ai/api/v1/chat/completions`,
          'https://pro.aiskt.com/v1/chat/completions',
          {
            ...data,
            stream: false,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
          },
        ),
      );

      // 检查响应状态码和自定义的code字段
      if (response.status !== 200 || !response.data) {
        console.log(`微软 ai 错误 ${response.data.msg}`);
        throw new HttpException(
          `${response.data.msg || 'Unknown error'}`,
          HttpStatus.INTERNAL_SERVER_ERROR, // 根据实际情况调整状态码
        );
      }
      try {
        return response.data.choices[0]?.message?.content as string;
      } catch (error) {
        console.log(`微软 ai 错误 ${error} ${JSON.stringify(response.data)}`);
        return null;
      }
    } catch (error) {
      // 处理请求过程中的错误（如网络问题）
      throw error;
    }
  }

  /**
   * post流式请求
   * @param url
   * @param data
   * @param headers
   * @returns
   */
  streamPost(url: string, data: unknown, callback: (str: string) => void) {
    // config.responseType = 'stream';
    const { apiKey } = this.configService.get('gpt');
    let str = '';
    const response = this.httpService
      .post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .pipe(
        map((res) => {
          const list: string[] = res.data
            .toString()
            .split('\n')
            .filter((item) => item.length > 15);

          list.forEach((item) => {
            if (item.indexOf('data:') > -1) {
              const delta = item.replace('data:', '');
              str =
                str +
                (JSON.parse(delta).choices.map(
                  (n: { delta: { content: string } }) => n.delta?.content,
                ) || '');
            }
          });
          return res.data;
        }),
        finalize(() => {
          // 在这里处理“流结束”的逻辑，无论是正常完成还是发生错误
          // console.log('str', str);
          callback(str);
          // 你可以在这里添加清理代码、日志记录或其他逻辑
        }),
      );
    // response.subscribe((data: string) => {
    //   const list: string[] = data
    //     .split('\n')
    //     .filter((item) => item.length > 15);

    //   list.forEach((item) => {
    //     if (item.indexOf('data:') > -1) {
    //       const delta = item.replace('data', '"data"');
    //       // console.log('delta', delta);
    //       str = str + (JSON.parse(`{${delta}}`).data.content || '');
    //     }
    //   });
    // });

    return response;
  }
}
