import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {ResultComponent} from './result.component';
import {LikeComponent} from './like/like.component';
import {DefinitionComponent} from './definition/definition.component';
import {BarRatingModule} from 'ngx-bar-rating';
import {MaterialModule} from '../../material.module';
import {AudioDirective} from '../../directives/audio.directive';
import {ItalicDirective} from '../../directives/italic.directive';

@NgModule({
  declarations: [ResultComponent, LikeComponent, DefinitionComponent, AudioDirective, ItalicDirective],
  imports: [BrowserModule, BarRatingModule, MaterialModule],
  exports: [ResultComponent, LikeComponent]
})
export class ResultModule {
}
