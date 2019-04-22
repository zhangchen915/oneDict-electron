import {
  Component,
  EventEmitter,
  Input, OnInit, Output,
} from '@angular/core';
import {MdictService} from '../../../services/mdict.service';
import {ConfigService} from '../../../services/config.service';

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.scss']
})
export class DefinitionComponent implements OnInit {
  definition;
  fontSize;

  constructor(private mdict: MdictService,
              private config: ConfigService) {
    this.fontSize = config.store.get('fontSize') + 'px';
  }

  @Input() type;
  @Input() res;
  @Input() word;

  async ngOnInit() {
    if (!this.type.web) this.definition = await this.mdict.getTranslation(this.type.name, this.word);
  }

}
