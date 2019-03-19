import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  sidenavState = new BehaviorSubject<boolean>(true);
  sidenavIndex = new BehaviorSubject<number>(0);

  constructor(private snackBar: MatSnackBar) {
  }

  toggleSidenav() {
    this.sidenavState.next(!this.sidenavState.getValue());
  }

  getSidenavState(): Observable<boolean> {
    return this.sidenavState.asObservable();
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
      horizontalPosition: 'right'
    });
  }
}
