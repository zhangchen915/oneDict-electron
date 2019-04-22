import {Injectable} from '@angular/core';

const Store = require('electron-store');

export interface Config {
  file: Object;
  fontSize: number;
  reviewNumber: number;
  copyBoard: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private store;
  public value: Config;


  constructor() {
    this.store = new Store({
      defaults: {
        fontSize: 16,
        reviewNumber: 20,
        copyBoard: false,
      }
    });

    this.value = this.store.store;

    this.store.onDidChange('file', e => {
      this.value.file = e;
    });
  }

  save() {
    this.store.store = this.value;
  }
}
