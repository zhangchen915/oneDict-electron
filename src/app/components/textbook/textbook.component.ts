import {Component, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {MessageService} from '../../services/message.service';
import {ActivatedRoute} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';

import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {GlossaryDocumentType} from '../../schemas/glossary.schema';
import {CardComponent} from '../card/card.component';

@Component({
  selector: 'app-textbook',
  templateUrl: './textbook.component.html',
  styleUrls: ['./textbook.component.scss']
})
export class TextbookComponent implements OnInit {
  displayedColumns: string[] = ['select', 'word', 'definition', 'addTime'];
  dataSource: MatTableDataSource<GlossaryDocumentType>;
  selection = new SelectionModel<GlossaryDocumentType>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private message: MessageService,
              private router: ActivatedRoute,
              private dbService: DatabaseService,
              private dialog: MatDialog) {
    router.data.subscribe(e => {
      message.sidenavIndex.next(e.state);
    });
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
    this.dataSource = new MatTableDataSource(await this.dbService.getGlossary());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async openDialog() {
    this.dialog.open(CardComponent, {
      width: '300px',
      height: '300px',
      data: await this.dbService.getGlossary(20)
    });
  }
}
