import {Component, Input, OnInit} from '@angular/core';
import {ResultApiService} from '../../providers/result.service';
import {forkJoin} from 'rxjs';

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
  tabs = ['a', 'b'];

  constructor(private api: ResultApiService) {
  }

  async ngOnInit() {
  }

  getRes(word) {
    forkJoin(
      this.api.youdao(word),
      this.api.sougou(word)
    ).subscribe(res => {
      this.res = Object.assign(res[0], res[1]);
      console.log(this.res);
    });
  }
}
