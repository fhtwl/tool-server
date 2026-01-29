import { Module } from '@nestjs/common';
import { CodeController } from './code.controller';

@Module({
  controllers: [CodeController],
})
export default class CodeModule {}
