import { Module } from '@nestjs/common';
import { AppSessionController } from './session.controller';
import { AppSessionService } from './session.service';
import { HttpModule } from '@nestjs/axios';
import { GptService } from './gpt.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 150 * 1000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AppSessionController],
  providers: [AppSessionService,GptService],
  exports: [AppSessionService],
})
export default class AppSessionModule {}
