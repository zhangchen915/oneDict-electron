import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../services/message.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {


  constructor(private message: MessageService) {
  }

  ngOnInit() {

  }

}
