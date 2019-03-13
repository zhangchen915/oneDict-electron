import {Component, Input, OnInit} from '@angular/core';
import {ResultApiService} from '../../providers/result.service';
import {forkJoin} from 'rxjs';
import {DatabaseService} from '../../services/database.service';
import {MdictService} from '../../services/mdict.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  @Input()
  set word(word: string) {
    this.getRes(word);
    this.getMdict(word);
  }

  res;
  tabs = [];

  constructor(private api: ResultApiService,
              private dbService: DatabaseService,
              private mdict: MdictService) {
  }

  async ngOnInit() {
  }

  async getRes(word) {
    forkJoin(
      this.api.youdao(word),
      this.api.sougou(word)
    ).subscribe(res => {
      this.res = Object.assign(res[0], res[1]);
    });
  }

  async getMdict(word) {
    this.tabs = await this.dbService.findAllFile();
    for (let i = 0; i < this.tabs.length; i++) {
      if (!this.tabs[i].web) {
        // delete this.tabs[i]._rev;
        const res = await this.mdict.getTranslation(this.tabs[i].name, word);
        console.log(res);
      }
    }
  }
}
