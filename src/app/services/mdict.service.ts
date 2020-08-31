import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {ipcRenderer} from 'electron';

@Injectable({
  providedIn: 'root'
})
export class MdictService {
  private mdict = {};

  constructor(private dbService: DatabaseService) {
  }

  async init(file?) {
    if (!file) file = await this.dbService.findAllFile();
    ipcRenderer.send('initMdict', file);
  }

  async getTranslation(name, query) {
    return ipcRenderer.sendSync('getTranslation', {name, query});
  }
}

