import {Component, OnInit} from '@angular/core';
import {TranslateService} from '../../providers/translate.service';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {
  text: string;
  translation: string;
  inputChange = new Subject();

  constructor(private translate: TranslateService) {
    this.inputChange.pipe(
      debounceTime(200)
    ).subscribe(res => {
      this.translate.youdao(res).subscribe(res => {
        console.log(res);
        // this.translation = res;
      });
    });
  }

  ngOnInit() {

  }

  onChange() {
    this.inputChange.next(this.text);
  }
}
