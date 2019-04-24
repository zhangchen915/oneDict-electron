import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {TextbookCollection} from '../../schemas/textbook.schema';

@Component({
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {
  index = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Array<TextbookCollection>,
              private dbService: DatabaseService) {
  }

  ngOnInit() {
  }

  next() {
    if (this.index === this.data.length - 1) return;
    this.index += 1;
  }

  review(remember: boolean) {
    const current = this.data[this.index];
    let state = current.state;
    if (state) state = remember ? state + 1 : state - 1;
    this.dbService.review(current.word, state);
    this.next();
  }

  ngOnDestroy() {
  }
}
