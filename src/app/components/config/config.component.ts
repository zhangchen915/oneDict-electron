import {Component, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnDestroy {
  todo = [];
  done = [];

  constructor(private dbService: DatabaseService) {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log(event);
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
        console.log(e.use);
        json.use ? this.todo[json.use - 1] = json : this.done.push(json);
      });
    });
  }

  ngOnDestroy(): void {

  }

}
