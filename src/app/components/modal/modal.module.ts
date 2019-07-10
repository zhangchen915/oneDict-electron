import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MaterialModule} from '../../material.module';
import {TextbookManageComponent} from './textbookManage/textbookManage.component';

@NgModule({
  declarations: [TextbookManageComponent],
  imports: [BrowserModule, MaterialModule],
  exports: [TextbookManageComponent],
  providers: []
})
export class ModalModule {
}
