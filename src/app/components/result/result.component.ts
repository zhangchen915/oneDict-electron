import {Component, Input, OnInit} from '@angular/core';
import {ResultApiService} from '../../providers/result.service';
import {forkJoin} from 'rxjs';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  @Input() tab;

  @Input()
  set word(word: string) {
    this.getRes(word);
  }

  res;
  tabs = [];

  constructor(private api: ResultApiService, private dbService: DatabaseService) {
    this.dbService.db.file.find().where('use').gt(0).exec().then(
      res => res.forEach(e => this.tabs.push(e.toJSON())));
  }

  async ngOnInit() {
  }

  getRes(word) {
    forkJoin(
      this.api.youdao(word),
      this.api.sougou(word)
    ).subscribe(res => {
      this.res = Object.assign(res[0], res[1]);
    });
  }
}
