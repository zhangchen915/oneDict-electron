import {Injectable} from '@angular/core';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor() {
  }

  static downloadFile(url: URL, filePath: fs.PathLike): Promise<any> {
    return new Promise((resolve, reject) => {
      http.get(url, res => {
        res.setEncoding('binary');
        let fileData = '';
        res.on('data', chunk => fileData += chunk);
        res.on('end', () => {
          fs.writeFile(filePath, fileData, 'binary', err => {
            resolve();
            if (err) reject(err);
          });
        });
      });
    });
  }

  static deleteDirSync(filePath: string) {
    let files = [];

    if (fs.existsSync(filePath)) {
      files = fs.readdirSync(filePath);
      files.forEach(file => {
        const curPath = path.join(filePath, file);

        if (fs.statSync(curPath).isDirectory()) {
          this.deleteDirSync(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });

      fs.rmdirSync(filePath);
    } else {
      console.log('给定的路径不存在！');
    }
  }
}
