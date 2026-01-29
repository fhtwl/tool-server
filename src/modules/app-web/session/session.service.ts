import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PassThrough } from 'stream';
// import { PassThrough } from 'stream';
@Injectable()
export class AppSessionService {
  private access_token: string;
  private expires_in: number;
  private timestamp: number;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  public async getToken(): Promise<any> {
    return new Promise(async (resolve) => {
      const { access_token, expires_in, timestamp } = this;
      if (access_token && new Date().getTime() < expires_in + timestamp) {
        resolve(access_token);
      } else {
        console.log(`刷新xiaoe token`);
        // this.get<{ access_token: string; expires_in: number }>(
        //   `${configuration().xiaoe.baseUrl}/token`,
        // )
        //   .then((data) => {
        //     this.expires_in = data.expires_in;
        //     this.access_token = data.access_token;
        //     resolve(this.access_token);
        //   })
        //   .catch((error) => {
        //     reject(error);
        //   });
        const xiaoe = this.configService.get('xiaoe');
        this.httpService
          .get(`${xiaoe.baseUrl}/token`, {
            params: {
              ...xiaoe,
              grant_type: 'client_credential',
            },
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .subscribe((res) => {
            const { expires_in, access_token } = res.data.data;
            this.expires_in = expires_in;
            this.access_token = access_token;
            resolve(this.access_token);
          });
      }
    });
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    const xiaoe = this.configService.get('xiaoe');
    try {
      const access_token = await this.getToken();
      if (typeof params === 'object') {
        (params as Common.Params).access_token = access_token;
      }
      const response = await firstValueFrom(
        this.httpService.get(`${xiaoe.baseUrl}${url}`, {
          params: params,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      // 检查响应状态码和自定义的code字段
      if (response.status !== 200 || response.data.code !== 0) {
        // throw new HttpException(
        //   `小鹅通错误 Error: ${response.data.message || 'Unknown error'}`,
        //   HttpStatus.INTERNAL_SERVER_ERROR, // 根据实际情况调整状态码
        // );
        console.log(response.data.message);
        return null;
      }

      // 返回实际的数据
      return response.data.data as T;
    } catch (error) {
      // 处理请求过程中的错误（如网络问题）
      throw error;
    }
  }

  public async post<T, R>(url: string, data: T): Promise<R> {
    // const xiaoe = this.configService.get('xiaoe');
    try {
      // const access_token = await this.getToken();
      // if (typeof data === 'object') {
      //   (data as Common.Params).access_token = access_token;
      // }
      const cozeToken = this.configService.get('cozeToken');
      const response = await firstValueFrom(
        this.httpService.post(`https://api.coze.cn${url}`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cozeToken}`,
          },
        }),
      );

      // 检查响应状态码和自定义的code字段
      if (response.status !== 200 || response.data.code !== 0) {
        console.log(`coze错误 ${response.data.msg}`);
        throw new HttpException(
          `${response.data.msg || 'Unknown error'}`,
          HttpStatus.INTERNAL_SERVER_ERROR, // 根据实际情况调整状态码
        );
      }

      // 返回实际的数据
      return response.data.data as R;
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
  streamPost(url: string, data: unknown, config?: any): PassThrough {
    // config.responseType = 'stream';
    const response$ = this.httpService.post(url, data, config);
    // 创建一个PassThrough流来传递响应数据
    const passThrough = new PassThrough();
    // 使用firstValueFrom将Observable转换为Promise
    response$.subscribe((response) => {
      passThrough.emit('data', response.data);
      console.log('响应数据:-----------', response.data);
    });
    firstValueFrom(
      response$.pipe(
        map((response) => {
          console.log('响应数据:-----------', response.data);
          passThrough.emit('data', response.data);
          return response.data;
        }),
        catchError((error) => {
          passThrough.emit('error', error.message);
          return throwError(new Error(error.message));
        }),
      ),
    );

    // (async () => {
    //   try {
    //     const response = await responsePromise;
    //     console.log('响应数据:', response);
    //     // response.pipe(passThrough);
    //     passThrough.emit('data', response);
    //   } catch (error) {
    //     passThrough.emit('error', error);
    //   }
    // })();

    return passThrough;
  }
}
