import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  sidenavState = new BehaviorSubject(true);

  constructor() {
  }

  toggleSidenav() {
    this.sidenavState.next(!this.sidenavState.getValue());
  }

  getSidenavState(): Observable<boolean> {
    return this.sidenavState.asObservable();
  }
}
