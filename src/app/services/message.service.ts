import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  sidenavState = new BehaviorSubject<boolean>(true);
  sidenavIndex = new BehaviorSubject<number>(0);
  loginState = new BehaviorSubject<string>(this.jwtHelper.isTokenExpired() ? '' : localStorage.getItem('email'));

  constructor(private snackBar: MatSnackBar,
              private jwtHelper: JwtHelperService) {
  }

  toggleSidenav() {
    this.sidenavState.next(!this.sidenavState.getValue());
  }

  getSidenavState(): Observable<boolean> {
    return this.sidenavState.asObservable();
  }

  setLoginState(state) {
    this.openSnackBar(state ? '登陆成功' : '已退出');
    this.loginState.next(state);
  }

  openSnackBar(message: string, action?: string) {
    return Promise.resolve().then(() => this.snackBar.open(message, action, {
      duration: 1000,
      horizontalPosition: 'right'
    }));
  }
}
