import {Component, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {MessageService} from '../../services/message.service';
import {ActivatedRoute} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';

import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {TextbookDocument, TextbookDocumentType} from '../../schemas/textbook.schema';
import {DialogService} from '../../services/dialog.service';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'app-textbook',
  templateUrl: './textbook.component.html',
  styleUrls: ['./textbook.component.scss']
})
export class TextbookComponent implements OnInit {
  textbook = localStorage.getItem('textbook');
  displayedColumns: string[] = ['select', 'word', 'state', 'updateTime'];
  dataSource: MatTableDataSource<TextbookDocumentType>;
  selection = new SelectionModel<TextbookDocumentType>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private message: MessageService,
              private router: ActivatedRoute,
              private dbService: DatabaseService,
              private config: ConfigService,
              private dialog: DialogService) {
    router.data.subscribe(e => {
      message.sidenavIndex.next(e.state);
    });
  }

  async chooseTextbook() {
    const name = 'cet4';
    if (this.textbook === name) return this.message.openSnackBar('课本已经添加');
    if (!this.dialog.checkLogin()) return;
    this.dbService.creatTextbookDB(name).then((res => {
      res.subscribe(completed => {
        if (!completed) return this.message.openSnackBar('添加课本失败');
        this.textbook = name;
        localStorage.setItem('textbook', name);
        this.dbService.syncTextbook(name);
      });
    }));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  async ngOnInit() {
    if (this.textbook) {
      this.dataSource = new MatTableDataSource(await this.dbService.getTextbook(100));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  async review() {
    this.dialog.openCard(await this.dbService.getTextbook(this.config.value.reviewNumber, -1, 4));
  }
}
