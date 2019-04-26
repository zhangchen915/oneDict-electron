import {AfterViewInit, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {MdictService} from '../../services/mdict.service';
import {Suggest, SuggestEntity, SuggestService} from '../../providers/suggest.service';
import {HomeAnimation} from '../../animations/home.animation';
import {Subject, timer} from 'rxjs';
import {debounce} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {DatabaseService} from '../../services/database.service';
import {AppInitService} from '../../services/init.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [HomeAnimation]
})
export class HomeComponent implements OnInit, AfterViewInit {
  word = '';
  items;
  listListener;
  animationState = '0';
  inputChange = new Subject();
  history = [];
  spell = {
    correct: false,
    suggest: []
  };

  @ViewChild('list') $list;

  constructor(private renderer: Renderer2,
              public message: MessageService,
              public init: AppInitService,
              private mdict: MdictService,
              private suggest: SuggestService,
              private router: ActivatedRoute,
              private dbService: DatabaseService) {
    router.data.subscribe(e => {
      message.sidenavIndex.next(e.state);
    });

    this.inputChange.pipe(
      debounce(() => timer(300))
    ).subscribe(e => {
      if (!e) {
        this.animationState = '0';
      } else {
        this.animationState = '1';
        this.spell = this.suggest.spell(e);
        this.suggest.icibaSuggest(e).subscribe(res => this.items = res);
      }
    });
  }

  async ngOnInit() {
    this.history = await this.dbService.getHistory();
  }

  ngAfterViewInit() {
    this.listListener = this.renderer.listen(this.$list.nativeElement, 'click', e => {
      if (e.target.classList.contains('search-item')) {
        this.word = e.target.innerHTML;
        this.search();
      }
    });
  }

  async search(word = this.word) {
    this.word = word.toLowerCase();
    this.animationState = '2';
    this.spell.suggest = [];
    await this.dbService.db.history.insert({
      word,
      searchTime: new Date().toLocaleString()
    });
  }

  getPart(item) {
    return item.means.length ? item.means[0].part : '';
  }

  onChange() {
    this.inputChange.next(this.word.trim().toLowerCase());
  }

  enterClick() {
    if (!this.word) return;
    if (!this.spell.correct) return this.message.openSnackBar('您输入的单词不正确');
    this.search();
  }
}
