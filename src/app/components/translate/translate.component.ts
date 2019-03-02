import {Component, OnInit} from '@angular/core';
import {TranslateService} from '../../providers/translate.service';
import {Subject, timer} from 'rxjs';
import {debounce} from 'rxjs/operators';

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
      debounce(() => timer(500))
    ).subscribe(res => {
      this.translate.youdao(res).subscribe(transRes => this.translation = transRes);
    });
  }

  ngOnInit() {

  }

  onChange() {
    this.inputChange.next(this.text);
  }
}
