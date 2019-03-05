import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {MdictService} from '../../services/mdict.service';
import {Suggest, SuggestEntity, SuggestService} from '../../providers/suggest.service';
import {HomeAnimation} from '../../animations/home.animation';
import {Subject, timer} from 'rxjs';
import {debounce} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [HomeAnimation]
})
export class HomeComponent implements OnInit, AfterViewInit {
  word = '';
  items: [SuggestEntity] = [{
    entry: '',
    explain: ''
  }];
  listListener;
  animationState = '0';
  inputChange = new Subject();

  @ViewChild('list') $list;

  constructor(private renderer: Renderer2,
              private message: MessageService,
              private mdict: MdictService,
              private suggest: SuggestService,
              private router: ActivatedRoute) {
    router.data.subscribe(e => {
      message.sidenavIndex.next(e.state);
    });

    this.inputChange.pipe(
      debounce(() => timer(300))
    ).subscribe(() => {
      this.suggest.getSuggest(this.word).subscribe((res: Suggest) => this.items = res.data.entries);
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.listListener = this.renderer.listen(this.$list.nativeElement, 'click', e => {
      if (e.target.classList.contains('search-item')) {
        this.word = e.target.innerHTML;
        this.animationState = '2';
      }
    });
  }

  onChange() {
    this.animationState = '1';
    this.inputChange.next(this.word);
  }

  enterClick(e) {
    if (e.key === 'Enter') {
      this.animationState = '2';
    }
  }
}
