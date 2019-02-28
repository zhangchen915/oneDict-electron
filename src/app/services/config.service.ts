import {Injectable} from '@angular/core';

const Store = require('electron-store');

export interface Config {
  defaultDictPath: String;
  file: Object;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public store;
  public config: Config;


  constructor() {
    this.store = new Store();
    this.store.onDidChange('file', e => {
      this.config.file = e;
    });
  }

  getDefaultDict() {
    return this.store.get('defaultDictPath');
  }

}
