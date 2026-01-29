import { Injectable } from '@nestjs/common';
// import { join } from 'path';

@Injectable()
export class UploadService {
  async uploadImg(file: Express.Multer.File) {
    const date = new Date();
    const suffixName = file.mimetype?.split('/')[1];
    const fileName = `${date.getTime()}-${Math.floor(
      Math.random() * 100000,
    )}.${suffixName}`;
    console.log(fileName);
    // const path = join(`${Config.UPLOAD_DIR}`, fileName);
    // await fsExtra.move(file.filepath, path);
    // return {
    //   path: `${Config.UPLOAD.PATH}/${fileName}`,
    //   name: fileName,
    //   mimetype: file.mimetype,
    //   size: file.size,
    // };
  }

  async saveLocal(file: Express.Multer.File) {
    const date = new Date();
    const suffixName = file.mimetype?.split('/')[1];
    const fileName = `${date.getTime()}-${Math.floor(
      Math.random() * 100000,
    )}.${suffixName}`;
    console.log(fileName);
    // const path = join(`${Config.UPLOAD_DIR}`, fileName);
    // await fsExtra.move(file.filepath, path);
    // return {
    //   path: `${Config.UPLOAD.PATH}/${fileName}`,
    //   name: fileName,
    //   mimetype: file.mimetype,
    //   size: file.size,
    // };
  }
}
