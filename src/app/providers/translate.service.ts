import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {retry} from 'rxjs/operators';
import {params} from '../util';

const options = {
  headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
};

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(private http: HttpClient) {
  }

  youdao(word) {
    return this.http.post(`http://fanyi.youdao.com/translate?${params({
      doctype: 'json',
      jsonversion: ''
    })}`, {
      i: word
    }, options);
  }
}
