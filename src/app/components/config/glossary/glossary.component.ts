import {Component, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../../../services/database.service';
import {MessageService} from '../../../services/message.service';
import {SelectionModel} from '@angular/cdk/collections';

import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {GlossaryDocumentType} from '../../../schemas/glossary.schema';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit {
  displayedColumns: string[] = ['select', 'word', 'definition', 'addTime'];
  dataSource: MatTableDataSource<GlossaryDocumentType>;
  selection = new SelectionModel<GlossaryDocumentType>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private message: MessageService,
              private dbService: DatabaseService) {
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
}
