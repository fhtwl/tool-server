import { Global, Module } from '@nestjs/common';
import { WsService } from './ws.service';
// import { WsGateway } from './ws.gateway';
import { WsController } from './ws.controller';
import { AppSessionService } from '../app-web/session/session.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 5,
    }),
  ],
  providers: [WsService, AppSessionService], //WsGateway
  controllers: [WsController], // 这个是 HTTP 服务, 可有可无
  exports: [WsService],
})
export default class WsModule {}
