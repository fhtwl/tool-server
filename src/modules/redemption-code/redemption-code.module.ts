import { Module } from '@nestjs/common';
import RedemptionCodeController from './redemption-code.controller';
import { RedemptionCodeService } from './redemption-code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedemptionCode } from './redemption-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RedemptionCode])],
  controllers: [RedemptionCodeController],
  providers: [RedemptionCodeService],
})
export default class RedemptionCodeServiceModule {}
