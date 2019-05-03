import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {DatabaseService} from '../../services/database.service';
import {MessageService} from '../../services/message.service';
import {ActivatedRoute} from '@angular/router';
import {MdictService} from '../../services/mdict.service';
import {TtsService} from '../../services/tts.service';
import {ConfigService} from '../../services/config.service';
import {ElectronService} from '../../providers/electron.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnDestroy {
  step = 0;
  showList = [];
  hideList = [];
  fileInput;
  voices: SpeechSynthesisVoice[];
  selected;

  @ViewChild('file') file;

  constructor(private message: MessageService,
              private electron: ElectronService,
              private config: ConfigService,
              private router: ActivatedRoute,
              private dbService: DatabaseService,
              private mdict: MdictService) {
    router.data.subscribe(e => {
      message.sidenavIndex.next(e.state);
    });

    speechSynthesis.onvoiceschanged = () => this.voices = speechSynthesis.getVoices();
    this.voices = speechSynthesis.getVoices();
    this.selected = TtsService.tts;
  }

  setStep(index: number) {
    this.step = index;
  }

  addFile() {
    const file = this.fileInput.files[0];
    if (!this.showList.concat(this.hideList).find(e => e.name === file.name)) {
      this.showList.push({
        name: file.name,
        path: file.path,
      });
    }

    this.file.clear();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  ngOnInit() {
    this.dbService.db.file.find().exec().then(res => {
      res.forEach(e => {
        const json = e.toJSON();
        json.use ? this.showList[json.use - 1] = json : this.hideList.push(json);
      });
    });
  }

  clipboard() {
    const watch = this.electron.clipboardListen();
    if (!this.config.value.copyBoard) watch.stop();
  }

  async ngOnDestroy() {
    this.showList.map((e, i) => e.use = i + 1);
    this.hideList.map(e => e.use = 0);
    await this.mdict.init(this.showList);
    this.dbService.db.file.find().remove().then(() => {
      this.showList.concat(this.hideList).forEach(async e => {
        delete e._rev;
        await this.dbService.db.file.insert(e);
      });
    });

    TtsService.tts = this.selected;
    this.message.openSnackBar('已保存');
  }
}
