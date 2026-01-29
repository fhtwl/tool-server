import { Module } from '@nestjs/common';
import { GitController } from './git.controller';
import { GitService } from './git.service';

@Module({
  providers: [GitService],
  controllers: [GitController],
})
export default class GitModule {}
