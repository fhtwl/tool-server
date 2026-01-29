import { Module } from '@nestjs/common';
import { AppToolWordController } from './word.controller';
import { AppToolWordService } from './word.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 150 * 1000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AppToolWordController],
  providers: [AppToolWordService],
  exports: [AppToolWordService],
})
export default class AppToolWordModule {}
