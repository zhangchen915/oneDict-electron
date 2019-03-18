import {
  Component,
  EventEmitter,
  Input, OnInit, Output,
} from '@angular/core';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss']
})
export class LikeComponent implements OnInit {
  constructor() {
  }

  @Input() like;
  @Output() likeChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
  }

  onClick(c) {
    this.likeChange.emit(c);
  }
}
