import {Component, Input, OnInit} from '@angular/core';
import {ResultApiService} from '../../providers/result.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  @Input() tab;
  @Input() word: string;
  res;
  tabs = ['a', 'b'];

  constructor(private api: ResultApiService) {
  }

  async ngOnInit() {
    this.api.youdao(this.word).subscribe((res: any) => {
      const base = res.ec.word[0].trs.map(e => e.tr[0].l.i[0]);
      const collins = res.collins.collins_entries[0];
      let wordForm = collins.basic_entries.basic_entry[0].wordforms.wordform || [];
      if (wordForm) wordForm = wordForm.map(e => e.word);
      this.res = {
        base,
        type: res.ec.exam_type,
        collins: {
          star: collins.star,
          wordForm,
          entry: collins.entries.entry.map(e => e.tran_entry[0])
        }
      };
    });


  }
}
