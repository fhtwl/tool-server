import fs from 'fs';
import JSZip from 'jszip';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import configuration from 'src/config/configuration';

const WATERMARK_PATTERNS = [
  /<v:shape[\s\S]*?<\/v:shape>/gi,
  /<v:textpath[\s\S]*?<\/v:textpath>/gi,
  /<w:pict[\s\S]*?<\/w:pict>/gi,
  /<v:background[\s\S]*?<\/v:background>/gi,
  /<w:background[\s\S]*?<\/w:background>/gi
];

export async function removeUltimateWatermark(file: Express.Multer.File) {
  const zip = new JSZip();
  const buffer = file.buffer
  const uint8Array = new Uint8Array(buffer);
  const docx = await zip.loadAsync(uint8Array);

  const xmlFiles = Object.keys(docx.files).filter(
    name => name.startsWith('word/') && name.endsWith('.xml')
  );

  for (const file of xmlFiles) {
    let xml = await docx.file(file).async('string');
    let original = xml;

    WATERMARK_PATTERNS.forEach(reg => {
      xml = xml.replace(reg, '');
    });

    if (xml !== original) {
      docx.file(file, xml);
    }
  }

  // 顺手干掉主题（WPS 常见）
  if (docx.file('word/theme/theme1.xml')) {
    docx.remove('word/theme/theme1.xml');
  }

  const out = await  docx.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9 // 最大压缩
    }
  }) as Buffer;
  const { dirPath, dirPrefix } = configuration().upload;
  const fileName = `${uuid()}.docx`;
  const fullPath = path.join(`${dirPath}${dirPrefix}`, fileName);

    // fs.writeFileSync(fullPath, zip.generate({ type: 'nodebuffer' }));

  fs.writeFileSync(fullPath, new Uint8Array(out)); // 生成文件  
  return `${dirPrefix}/${fileName}`;
}
