import {AfterViewInit, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {MdictService} from '../../services/mdict.service';
import {Suggest, SuggestEntity, SuggestService} from '../../providers/suggest.service';
import {HomeAnimation} from '../../animations/home.animation';
import {Subject, timer} from 'rxjs';
import {debounce} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {getDaily} from '../../util';
import {DatabaseService} from '../../services/database.service';
import {LoginComponent} from '../login/login.component';
import {MatDialog} from '@angular/material';

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
  private daily;
  private history = [];
  private spellSuggest = [];

  @ViewChild('list') $list;

  constructor(private renderer: Renderer2,
              private message: MessageService,
              private mdict: MdictService,
              private suggest: SuggestService,
              private router: ActivatedRoute,
              private dbService: DatabaseService,
              private dialog: MatDialog) {
    router.data.subscribe(e => {
      message.sidenavIndex.next(e.state);
    });

    this.inputChange.pipe(
      debounce(() => timer(300))
    ).subscribe(e => {
      this.spellSuggest = this.suggest.spell(e);

      if (!e) {
        this.animationState = '0';
      } else {
        this.animationState = '1';
        this.suggest.icibaSuggest(e).subscribe(res => this.items = res);
      }
    });
  }

  async ngOnInit() {
    this.daily = getDaily();
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
    this.word = word;
    this.animationState = '2';
    this.spellSuggest = [];
    await this.dbService.db.history.insert({
      word,
      searchTime: new Date().toLocaleString()
    });
  }

  openDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '300px',
      height: '300px',
      data: {username: ''}
    });
  }

  onChange() {
    this.inputChange.next(this.word);
  }

  enterClick(e) {
    if (e.key === 'Enter' && this.word) this.search();
  }
}
