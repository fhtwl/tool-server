import { Injectable } from '@nestjs/common';

import { exec } from 'child_process';

@Injectable()
export class GitService {
  // constructor...

  async getVersion(): Promise<{
    branch: string;
    lastCommitMessage: string;
    lastUpdateTime: string;
  }> {
    return new Promise((resolve, reject) => {
      exec('git rev-parse --abbrev-ref HEAD', (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          const branch = stdout.trim();

          exec('git log -1 --pretty=format:"%s %ci"', (error, log) => {
            if (error) {
              reject(error);
            } else {
              const [message, date] = log.trim().split(' ');
              resolve({
                branch,
                lastCommitMessage: message,
                lastUpdateTime: date,
              });
            }
          });
        }
      });
    });
  }
}
