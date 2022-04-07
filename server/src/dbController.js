import fs from 'fs';
import { resolve } from 'path';

const basePath = resolve();

const filenames = {
  // 해당 DB를 바라본다.
  messages: resolve(basePath, 'src/db/messages.json'),
  user: resolve(basePath, 'src/db/user.json'),
};

// 파일 읽어오기
export const readDB = (target) => {
  try {
    // JS로 바꿔주기 위해 JSON.parse
    return JSON.parse(fs.readFileSync(filenames[target], 'utf-8'));
  } catch (error) {
    console.log('error :', error);
  }
};

export const writeDB = (target, data) => {
  try {
    // data가 들어올 때 JS로 되어있기 때문에 JSON.stringify
    return fs.writeFileSync(filenames[target], JSON.stringify(data));
  } catch (err) {
    console.log('error :', error);
  }
};
