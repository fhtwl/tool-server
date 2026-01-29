import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import path from 'path';
import configuration from 'src/config/configuration';
import { promisify } from 'util';

const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

@Injectable()
export class FileService {
  directoryPath: string;
  constructor() {
    this.directoryPath = configuration().upload.dirPath; // 指定存储JSON文件的目录
  }

  async ensureDirectoryExists(): Promise<void> {
    const dirExists = await existsAsync(this.directoryPath);
    if (!dirExists) {
      await mkdirAsync(this.directoryPath, { recursive: true });
    }
  }

  async createAndWriteJsonFile(fileName: string, data: any): Promise<void> {
    // await this.ensureDirectoryExists();

    const filePath = path.join(this.directoryPath, `${fileName}`);
    const jsonString = JSON.stringify(data, null, 2); // 美化JSON字符串
    fs.writeFile(filePath, jsonString, 'utf8', (error) => {
      console.error(
        `Error creating and writing JSON file to ${filePath}:`,
        error,
      );
    });
  }
}
