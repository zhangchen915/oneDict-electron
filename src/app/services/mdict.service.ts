import {Injectable} from '@angular/core';
const Mdict = require('mdict-ts');
import {DatabaseService} from './database.service';

@Injectable({
  providedIn: 'root'
})
export class MdictService {
  private mdict = {};

  constructor(private dbService: DatabaseService) {
  }

  async init(file?) {
    if (!file) file = await this.dbService.findAllFile();
    file.forEach(e => {
      if (e.web || this.mdict.hasOwnProperty(e.name)) return;
      this.mdict[e.name] = new Mdict(e.path);
    });
  }

  async getTranslation(name, query) {
    return this.mdict[name].getWordList(query).then(res => {
      let definition = '';
      if (res.length) {
        res.some(e => {
          if (e.word === query) {
            definition = this.mdict[name].getDefinition(e.offset);
            return true;
          }
        });
      }
      return definition;
    });
  }
}

