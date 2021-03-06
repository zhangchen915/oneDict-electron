import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {GlossaryComponent} from './glossary/glossary.component';
import {ConfigComponent} from './config.component';
import {MaterialModule} from '../../material.module';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {FormsModule} from '@angular/forms';
import {TtsService} from '../../services/tts.service';

@NgModule({
  declarations: [ConfigComponent, GlossaryComponent],
  imports: [BrowserModule, MaterialModule, MaterialFileInputModule, FormsModule],
  exports: [ConfigComponent],
  providers: [TtsService]
})
export class ConfigModule {
}
