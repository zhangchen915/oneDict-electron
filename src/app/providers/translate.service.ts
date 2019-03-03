import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, retry, tap} from 'rxjs/operators';
import {params} from '../util';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(private http: HttpClient) {
  }

  youdao(text) {
    const payload = {
      i: text,
      doctype: 'json',
      jsonversion: ''
    };
    return this.http.post('http://fanyi.youdao.com/translate', params(payload), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).pipe(
      retry(2),
      map((res: any) => res.translateResult[0][0].tgt)
    );
  }
}
