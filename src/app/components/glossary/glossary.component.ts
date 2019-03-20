import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {FormBuilder} from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {ActivatedRoute} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';

import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {GlossaryDocumentType} from '../../schemas/glossary.schema';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'word', 'addTime'];
  dataSource: MatTableDataSource<GlossaryDocumentType>;
  selection = new SelectionModel<GlossaryDocumentType>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private message: MessageService, private router: ActivatedRoute,
              private dbService: DatabaseService, private fb: FormBuilder) {
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

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  ngOnDestroy(): void {

  }
}
