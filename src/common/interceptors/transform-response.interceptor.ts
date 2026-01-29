import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (
          !(data instanceof Error) &&
          typeof data === 'object' &&
          !(data instanceof StreamableFile)
        ) {
          return {
            code: data.code || '000000',
            data: data.data,
            msg: data.message || 'success',
          };
        } else {
          return data;
        }
      }),
    );
  }
}
