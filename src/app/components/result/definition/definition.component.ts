import {
  Component,
  EventEmitter,
  Input, OnInit, Output,
} from '@angular/core';
import {MdictService} from '../../../services/mdict.service';

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.scss']
})
export class DefinitionComponent implements OnInit {
  definition;

  constructor(private mdict: MdictService) {
  }

  @Input() type;
  @Input() res;
  @Input() word;

 async ngOnInit() {
    if (!this.type.web) this.definition = await this.mdict.getTranslation(this.type.name, this.word);
  }

}
