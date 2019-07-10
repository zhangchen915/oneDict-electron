import {Component, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../../../services/database.service';
import {MessageService} from '../../../services/message.service';
import {ActivatedRoute} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {TextbookDocumentType} from '../../../schemas/textbook.schema';
import {ConfigService} from '../../../services/config.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-textbook-manage',
  templateUrl: './textbookManage.component.html',
  styleUrls: ['./textbookManage.component.scss']
})
export class TextbookManageComponent implements OnInit {
  textbook = localStorage.getItem('textbook');
  dataSource: MatTableDataSource<TextbookDocumentType>;
  selection = new SelectionModel<TextbookDocumentType>(true, []);
  textbookList = {};

  constructor(private message: MessageService,
              private router: ActivatedRoute,
              private http: HttpClient,
              private dbService: DatabaseService,
              private config: ConfigService) {
    router.data.subscribe(e => {
      message.sidenavIndex.next(e.state);
    });
  }

  async ngOnInit() {
    await this.http.get('').subscribe(res => {
      this.textbookList = res;
    });
  }

}
