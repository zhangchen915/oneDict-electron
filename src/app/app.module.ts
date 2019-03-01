import 'reflect-metadata';
import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {HttpClientModule, HttpClient} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

// NG Translate
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {ElectronService} from './providers/electron.service';

import {WebviewDirective} from './directives/webview.directive';

import {AppComponent} from './app.component';
import {MaterialModule} from './material.module';
import {HomeComponent} from './components/home/home.component';
import {SearchComponent} from './components/search/search.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {MessageService} from './services/message.service';
import {ConfigService} from './services/config.service';
import {MdictService} from './services/mdict.service';
import {ResultApiService} from './providers/result.service';
import {ResultComponent} from './components/result/result.component';

import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import {TranslateComponent} from './components/translate/translate.component';
import {TranslateService} from './providers/translate.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    SearchComponent,
    SidenavComponent,
    ResultComponent,
    TranslateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    ScrollToModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService, MessageService, ConfigService, MdictService, ResultApiService, TranslateService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
