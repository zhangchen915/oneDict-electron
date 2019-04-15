import {Injectable} from '@angular/core';
import {params} from '../util';
import {map, retry} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import config from '../../../config';
import {MessageService} from '../services/message.service';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient,
              private message: MessageService) {
  }

  private setToken(token = '') {
    localStorage.setItem('access_token', token);
  }

  private post(payload, url) {
    return this.http.post(`//${config.domain}${url}`, params(payload), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).pipe(
      map((result: any) => {
        this.setToken(result.token);
        return result.error;
      }),
      retry(2));
  }

  login(payload) {
    return this.post(payload, '/auth/login');
  }

  register(payload) {
    return this.post(payload, '/register');
  }

  logout() {
    this.setToken();
    this.message.setLoginState('');
  }
}
