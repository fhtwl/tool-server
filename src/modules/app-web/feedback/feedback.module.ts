import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { AppFeedbackController } from './feedback.controller';
import { AppFeedbackService } from './feedback.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  controllers: [AppFeedbackController],
  providers: [AppFeedbackService],
})
export default class AppFeedbackModule {}
