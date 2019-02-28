import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class MdictService {
  lookup;

  constructor(private config: ConfigService) {
    // parse_mdict(this.config.getDefaultDict()).then(res => this.lookup = res);
  }

  getTranslation(file: File) {
    // return parse_mdict(file);
  }

  async getReactionWord(word) {

  }
}

