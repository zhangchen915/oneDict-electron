import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElectronService} from './providers/electron.service';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../environments/environment';
import {MessageService} from './services/message.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private sidenavState: boolean;
  private subscription: Subscription;

  constructor(public electronService: ElectronService,
              private translate: TranslateService,
              private message: MessageService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    this.sidenavState = this.message.sidenavState.getValue();
  }


  ngOnInit(): void {
    this.subscription = this.message.getSidenavState().subscribe(msg => {
      this.sidenavState = msg;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
