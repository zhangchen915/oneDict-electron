import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {Mdict} from 'mdict-ts';

@Injectable({
  providedIn: 'root'
})
export class MdictService {
  mdict;

  constructor(private config: ConfigService) {
    // this.mdict = new Mdict('ss');
  }

  getTranslation() {
    // return this.mdict.getDefinition('hello');
  }

  async getReactionWord(word) {

  }
}

