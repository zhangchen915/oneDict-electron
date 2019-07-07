import {Injectable} from '@angular/core';
import {app} from 'electron';

const zip = require('cross-zip');
const COLLECTION = 'collection.anki2';

enum CardType {
  new,
  learning,
  due
}

enum Queue {
  new,
  learning,
  due
}

@Injectable({
  providedIn: 'root'
})
export class ApkgService {
  static apkgPath = app.getAppPath() + '/apkg';

  constructor() {
  }

  static set unzip(fileName: string) {
    zip.unzipSync(fileName);
  }
}
