import fs from 'fs';
import { resolve } from 'path';

const basePath = resolve(); // 현재 경로

const filenames = {
  messages: resolve(basePath, 'src/db/messages.json'),
  users: resolve(basePath, 'src/db/users.json'),
};

// 파일 읽어오기
export const readDB = (target) => {
  try {
    // JS문법으로 바꿔주기 위해 JSON.parse
    return JSON.parse(fs.readFileSync(filenames[target], 'utf-8'));
  } catch (error) {
    console.log('error :', error);
  }
};

export const writeDB = (target, data) => {
  try {
    return fs.writeFileSync(filenames[target], JSON.stringify(data));
  } catch (err) {
    console.log('error :', error);
  }
};
