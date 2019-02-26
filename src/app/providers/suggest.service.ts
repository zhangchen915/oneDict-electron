import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {retry} from 'rxjs/operators';
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

  getSuggest(word) {
    return this.http.get<Suggest>('http://dict.youdao.com/suggest?' + params({
      q: word,
      le: 'eng',
      num: 80,
      doctype: 'json'
    })).pipe(retry(2));
  }
}
