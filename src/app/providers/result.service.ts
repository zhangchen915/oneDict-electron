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
export class ResultApiService {

  constructor(private http: HttpClient) {
  }


  youdao(word) {
    return this.http.get('http://dict.youdao.com/jsonapi?' + params({
      q: word,
      dicts: {
        'count': 99,
        'dicts': [['ec', 'exam_dict', 'collins']]
      },
      client: 'mobile',
      jsonversion: 2
    })).pipe(retry(2));
  }
}

