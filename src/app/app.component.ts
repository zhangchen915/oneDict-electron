import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElectronService} from './providers/electron.service';
import {TranslateService} from '@ngx-translate/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {MessageService} from './services/message.service';
import {Observable, Subscription} from 'rxjs';
import {RouterAnimation} from './animations/router.animation';
import {map, pairwise, startWith} from 'rxjs/operators';
import {getDaily} from './util';
import {MdictService} from './services/mdict.service';
import {ResultApiService} from './providers/result.service';
import {DatabaseService} from './services/database.service';
import {LoginService} from './providers/login.service';
import {DialogService} from './services/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [RouterAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
  public sidenavState: boolean;
  private subscription: Subscription;
  routeTrigger: Observable<object>;
  username;

  constructor(public electronService: ElectronService,
              private translate: TranslateService,
              private message: MessageService,
              private result: ResultApiService,
              private mdict: MdictService,
              private user: LoginService,
              private dialog: DialogService,
              private dbService: DatabaseService,
              public jwtHelper: JwtHelperService) {
    translate.setDefaultLang('en');

    this.sidenavState = message.sidenavState.getValue();
    this.routeTrigger = message.sidenavIndex.pipe(
      startWith(0),
      pairwise(),
      map(([prev, curr]) => ({
        value: curr,
        params: {
          offsetEnter: prev < curr ? 100 : -100,
          offsetLeave: prev < curr ? -100 : 100
        }
      })),
    );
  }

  ngOnInit() {
    this.subscription = this.message.getSidenavState().subscribe(msg => this.sidenavState = msg);
    this.message.loginState.subscribe(name => this.username = name);

    const daily = getDaily();
    if (!daily || new Date().toDateString() !== new Date(daily.dateline).toDateString()) fetch('http://open.iciba.com/dsapi', {
      headers: {'content-type': 'application/json'}
    }).then(async res => {
      localStorage.setItem('daily', await res.text());
    });

    this.result.sougoTokenInit();

    if (this.jwtHelper.isTokenExpired()) {
      // TODO 续期
      this.message.openSnackBar('登陆已过期，请重新登录');
    }

    if (this.username) this.dbService.setSync();
    this.mdict.init();
  }

  openDialog() {
    if (this.message.loginState.getValue()) {
      this.message.openSnackBar('您已经登录', '退出')
        .then(snack => snack.onAction().subscribe(() => this.user.logout()));
    } else {
      this.dialog.openLogin();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
