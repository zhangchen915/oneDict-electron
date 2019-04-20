import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {GlossaryDocumentType} from '../../schemas/glossary.schema';

@Component({
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {
  index = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Array<GlossaryDocumentType>,
              private dbService: DatabaseService) {
  }

  ngOnInit() {
  }

  next() {
    if (this.index === this.data.length - 1) return;
    this.index += 1;
  }

  know() {
    this.next();
  }

  ngOnDestroy() {
  }
}
