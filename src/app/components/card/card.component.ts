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
  progress = 0;
  row: Array<TextbookCollection>;
  learned;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private dbService: DatabaseService) {
    this.row = this.data.row;
    this.learned = this.data.learned;
  }

  ngOnInit() {
  }

  next() {
    this.progress = Math.ceil(this.learned.length * 100 / (this.row.length + this.learned.length));
    if (this.index === this.row.length - 1) return;
  }

  review(remember: boolean) {
    const current = this.row[this.index];
    let state = current.state;
    if (!remember) this.index += 1;
    if (remember) this.learned.push(this.row.splice(this.index, 1));
    if (!state.learned) {
      state = remember ? state + 1 : state - 1;
      if (state < 0) state = 0;
      this.dbService.review(current.word, state);
    }

    this.next();
  }

  ngOnDestroy() {
    localStorage.setItem('reviewList', JSON.stringify({
      row: this.row,
      learned: this.learned
    }));
  }
}
