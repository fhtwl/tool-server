import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PassThrough } from 'stream';
import { removeUltimateWatermark } from './remove-watermark.util';
// import { PassThrough } from 'stream';
@Injectable()
export class AppToolWordService {
  private access_token: string;
  private expires_in: number;
  private timestamp: number;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  removeWatermark = async (file: Express.Multer.File) => {
    return removeUltimateWatermark(file);
  }
}
