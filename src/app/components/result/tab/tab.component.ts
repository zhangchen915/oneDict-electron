import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {MessageService} from '../../../services/message.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit, AfterViewChecked {

  @Input() tabs;
  private selected = 0;
  change = true;

  constructor(private message: MessageService) {
  }

  @ViewChild('tabDiv') tabDiv: ElementRef;
  @ViewChild('inkBar') inkBar: ElementRef;

  ngOnInit() {
  }

  private position(element: HTMLElement) {
    return {
      left: element ? (element.offsetLeft || 0) + 'px' : '0',
      width: element ? (element.offsetWidth || 0) + 'px' : '0',
    };
  }

  ngAfterViewChecked(): void {
    if (this.change && this.tabDiv) {
      const positions = this.position(this.tabDiv.nativeElement.querySelector('.selected'));
      this.inkBar.nativeElement.style.left = positions.left;
      this.inkBar.nativeElement.style.width = positions.width;
      this.change = false;
    }
  }


  onSelect(index) {
    if (this.selected === index) return;
    this.selected = index;
    this.change = true;
  }
}
