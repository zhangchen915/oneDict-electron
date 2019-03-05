import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {DatabaseService} from '../../services/database.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnDestroy {
  showList = [];
  hideList = [];
  formDoc: FormGroup;
  fileInput;

  @ViewChild('file') file;

  constructor(private message: MessageService, private router: ActivatedRoute,
              private dbService: DatabaseService, private fb: FormBuilder) {
    router.data.subscribe(e => {
      message.sidenavIndex.next(e.state);
    });
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
    this.formDoc = this.fb.group({
      basicfile: [{value: undefined, disabled: false}]
    });

    this.dbService.db.file.find().exec().then(res => {
      res.forEach(e => {
        const json = e.toJSON();
        console.log(e.use);
        json.use ? this.showList[json.use - 1] = json : this.hideList.push(json);
      });
    });
  }

  ngOnDestroy(): void {
    this.showList.map((e, i) => e.use = i);
    this.hideList.map(e => e.use = 0);
    this.dbService.db.file.find().remove().then(() => {
      this.showList.concat(this.hideList).forEach(e => this.dbService.db.file.insert(e));
    });
  }

}
