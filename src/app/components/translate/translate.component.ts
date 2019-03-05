import {Component, OnInit} from '@angular/core';
import {TranslateService} from '../../providers/translate.service';
import {Subject, timer} from 'rxjs';
import {debounce} from 'rxjs/operators';
import {MessageService} from '../../services/message.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {
  text: string;
  translation: string;
  inputChange = new Subject();

  constructor(private message: MessageService, private router: ActivatedRoute, private translate: TranslateService) {
    router.data.subscribe(e => {
      message.sidenavIndex.next(e.state);
    });

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
