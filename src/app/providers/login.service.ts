import {Injectable} from '@angular/core';
import {params} from '../util';
import {map, retry} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import config from '../../../config';


@Injectable()
export class LoginService {

  constructor(private http: HttpClient) {
  }

  login(payload) {
    this.http.post(`${config.domin}/login`, params(payload), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).pipe(
      map((result: any) => {
        console.log(result);
        localStorage.setItem('access_token', result.token);
        return true;
      }),
      retry(2));
  }

  logout() {
    localStorage.removeItem('access_token');
  }
}
