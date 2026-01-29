import { Controller, Get } from '@nestjs/common';

import { Public } from 'src/common/decorator/public.decorator';
import { GitService } from './git.service';

@Controller('common/git')
export class GitController {
  constructor(private readonly service: GitService) {}

  @Get('/version')
  @Public()
  async getVersion() {
    return {
      data: await this.service.getVersion(),
    };
  }
}
