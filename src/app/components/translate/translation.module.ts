import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {TranslateComponent, TranslateControlComponent} from './translate.component';
import {MaterialModule} from '../../material.module';
import {FormsModule} from '@angular/forms';
import {TranslateService} from '../../providers/translate.service';

@NgModule({
  declarations: [TranslateComponent, TranslateControlComponent],
  imports: [BrowserModule, MaterialModule, FormsModule],
  exports: [TranslateComponent, TranslateControlComponent],
  providers: [TranslateService]
})
export class TranslationModule {
}
