import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {LoginComponent} from '../components/login/login.component';
import {MessageService} from './message.service';
import {CardComponent} from '../components/card/card.component';
import {TextbookManageComponent} from '../components/modal/textbookManage/textbookManage.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog,
              private message: MessageService) {
  }

  openLogin() {
    this.dialog.open(LoginComponent, {
      width: '300px',
      height: '300px',
      data: {username: ''}
    });
  }

  openCard(data) {
    if (!data.row.length) return this.message.openSnackBar('没有要学习的卡片');
    this.dialog.open(CardComponent, {
      width: '300px',
      height: '300px',
      data,
    });
  }

  openTextbookManage() {
    this.dialog.open(TextbookManageComponent, {
      width: '300px',
      height: '300px',
      data: {username: ''}
    });
  }

  checkLogin(): boolean {
    const state = this.message.loginState.getValue();
    if (!state) this.openLogin();
    return !!state;
  }
}
