import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {LoginComponent} from '../components/login/login.component';
import {MessageService} from './message.service';
import {CardComponent} from '../components/card/card.component';
import {DatabaseService} from './database.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog,
              private message: MessageService,
              private dbService: DatabaseService,) {
  }

  openLogin() {
    this.dialog.open(LoginComponent, {
      width: '300px',
      height: '300px',
      data: {username: ''}
    });
  }

  async openCard() {
    this.dialog.open(CardComponent, {
      width: '300px',
      height: '300px',
      data: await this.dbService.getGlossary(20)
    });
  }

  checkLogin(): boolean {
    const state = this.message.loginState.getValue();
    if (!state) this.openLogin();
    return !!state;
  }
}
