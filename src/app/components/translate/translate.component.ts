const {clipboard} = require('electron');
import {TtsService} from '../../services/tts.service';
import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '../../providers/translate.service';
import {MessageService} from '../../services/message.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-translate-control',
  template: `
    <div>
      <button mat-button (click)="copy()" [disabled]="!text">
        <mat-icon matSuffix>content_copy</mat-icon>
      </button>
      <button mat-button (click)="tts.speak(text)" [disabled]="!text">
        <mat-icon matSuffix>record_voice_over</mat-icon>
      </button>
    </div>`,
  styles: [`:host {
    position: absolute;
    right: 0;
    bottom: 0
  }`]
})
export class TranslateControlComponent {
  constructor(private message: MessageService, public tts: TtsService) {
  }

  @Input() text;

  copy() {
    clipboard.writeText(this.text);
    this.message.openSnackBar('复制成功');
  }
}


@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss'],
})
export class TranslateComponent implements OnInit {
  text: string;
  private preText: string;
  translation: string;

  constructor(private message: MessageService,
              private router: ActivatedRoute,
              private translateService: TranslateService) {
    router.data.subscribe(e => {
      message.sidenavIndex.next(e.state);
    });
  }

  ngOnInit() {
  }

  translate() {
    if (this.text === this.preText) return;
    this.preText = this.text;
    this.translateService.youdao(this.text).subscribe(transRes => this.translation = transRes);
  }
}
