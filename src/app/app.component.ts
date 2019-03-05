import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElectronService} from './providers/electron.service';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../environments/environment';
import {MessageService} from './services/message.service';
import {Observable, Subscription} from 'rxjs';
import {RouterAnimation} from './animations/router.animation';
import {map, pairwise, startWith, tap} from 'rxjs/operators';
import {log} from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [RouterAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
  private sidenavState: boolean;
  private subscription: Subscription;
  routeTrigger: Observable<object>;

  constructor(public electronService: ElectronService,
              private translate: TranslateService,
              private message: MessageService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
    } else {
    }

    this.sidenavState = this.message.sidenavState.getValue();

    this.routeTrigger = this.message.sidenavIndex.pipe(
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

  ngOnInit(): void {
    this.subscription = this.message.getSidenavState().subscribe(msg => {
      this.sidenavState = msg;
    });

    const daily = JSON.parse(localStorage.getItem('daily'));
    if (!daily || new Date().toDateString() !== new Date(daily.dateline).toDateString()) fetch('http://open.iciba.com/dsapi', {
      headers: {'content-type': 'application/json'}
    }).then(async res => {
      localStorage.setItem('daily', await res.text());
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
