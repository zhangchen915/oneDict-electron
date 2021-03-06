import {ipcRenderer} from 'electron';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, retry} from 'rxjs/operators';
import {params} from '../util';

export interface SuggestEntity {
  explain: string;
  entry: string;
}

export interface Suggest {
  result: {
    code: number,
    msg: string
  };
  data: {
    query: string,
    entries: [SuggestEntity],
    language: string
  };
}

@Injectable({
  providedIn: 'root'
})
export class SuggestService {
  constructor(private http: HttpClient) {
  }

  spell(word) {
    return ipcRenderer.sendSync('getSpell', word);
  }

  getSuggest(word) {
    return this.http.get<Suggest>('http://dict.youdao.com/suggest?' + params({
      q: word,
      le: 'eng',
      num: 80,
      doctype: 'json'
    })).pipe(retry(2));
  }

  icibaSuggest(word) {
    return this.http.get<any>(' http://dict-mobile.iciba.com/interface/index.php?' + params({
      c: 'word',
      m: 'getsuggest',
      num: 20,
      client: 6,
      is_need_mean: 1,
      word
    })).pipe(retry(2), map(e => e.message));
  }
}
