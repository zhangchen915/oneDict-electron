import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MdictService} from '../../services/mdict.service';
import {Suggest, SuggestEntity, SuggestService} from '../../providers/suggest.service';

const animation = trigger('openClose', [
  state('0', style({
    height: '60%',
  })),
  state('1', style({
    height: '100%',
  })),
  state('2', style({
    height: '20%',
  })),
  transition('0 => 1', [
    animate('.5s')
  ]),
  transition('1 => 2', [
    animate('.25s')
  ]),
  transition('2 => 1', [
    animate('.5s')
  ]),
  transition('2 => 0', [
    animate('.5s')
  ]),
]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [animation]
})
export class HomeComponent implements OnInit, AfterViewInit {
  word = '';
  items: [SuggestEntity] = [{
    entry: '',
    explain: ''
  }];
  listListener;
  animationState = '0';
  private translateTimer;

  @ViewChild('list') $list;

  constructor(private renderer: Renderer2,
              private message: MessageService,
              private mdict: MdictService,
              private suggest: SuggestService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.listListener = this.renderer.listen(this.$list.nativeElement, 'click', e => {
      if (e.target.classList.contains('search-item')) {
        this.search(e.target.innerHTML);
      }
    });
  }

  search(word: string) {
    if (!word) return;
    this.word = word;
    this.animationState = '2';
    console.log(this.word);
  }

  async setWord(e) {
    const input = e.currentTarget.value.trim();
    if (e.key === 'Enter') {
      this.search(input);
    } else if (this.word !== input) {
      if (this.translateTimer) clearTimeout(this.translateTimer);
      if (!input) return;
      this.word = input;
      this.animationState = '1';
      this.translateTimer = setTimeout(() => this.suggest.getSuggest(input).subscribe((res: Suggest) => this.items = res.data.entries), 150);
    }
  }
}
