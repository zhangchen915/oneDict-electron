import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ResultApiService} from '../../providers/result.service';
import {DatabaseService} from '../../services/database.service';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  private _word;
  @Input()
  set word(word: string) {
    this._word = word;
    if (word) this.api.getDefinition(word).then(res => this.res = res);
  }

  res: any;
  like = false;
  _like: boolean;
  tabs = [];

  constructor(private api: ResultApiService,
              private config: ConfigService,
              private dbService: DatabaseService,
  ) {
  }

  async ngOnInit() {
    this.like = await this.dbService.inGlossary(this._word);
    this._like = this.like;
    this.tabs = await this.dbService.findAllFile();
  }

  async ngOnDestroy() {
    if (this.like === this._like) return;
    await this.dbService.updateGlossary(this._word, this.like, this.res.base);
  }
}
