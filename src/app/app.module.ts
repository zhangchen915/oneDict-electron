import 'reflect-metadata';
import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

// NG Translate
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {ElectronService} from './providers/electron.service';
import {JwtModule} from '@auth0/angular-jwt';

import {AppComponent} from './app.component';
import {MaterialModule} from './material.module';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {SearchComponent} from './components/search/search.component';
import {CardComponent} from './components/card/card.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {TextbookComponent} from './components/textbook/textbook.component';
import {MessageService} from './services/message.service';
import {ConfigService} from './services/config.service';
import {MdictService} from './services/mdict.service';
import {DialogService} from './services/dialog.service';
import {TtsService} from './services/tts.service';
import {AppInitService} from './services/init.service';
import {ResultApiService} from './providers/result.service';
import {LoginService} from './providers/login.service';

import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import {TranslateService} from './providers/translate.service';
import {DatabaseService} from './services/database.service';
import {ResultModule} from './components/result/result.module';
import {ConfigModule} from './components/config/config.module';
import {TranslationModule} from './components/translate/translation.module';
import config from '../../config';
import {LoggingInterceptor} from './logging.interceptor';

export function INIT(init: AppInitService) {
  return () => init.Init();
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    CardComponent,
    SidenavComponent,
    TextbookComponent,
    LoginComponent,
  ],
  entryComponents: [LoginComponent, CardComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    ResultModule,
    ConfigModule,
    TranslationModule,
    ScrollToModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: [config.domain],
        blacklistedRoutes: ['youdao.com', 'sogou.com', 'iciba.com']
      }
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: INIT,
      deps: [AppInitService],
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true},
    AppInitService, ElectronService, DatabaseService, MessageService, ConfigService,
    MdictService, ResultApiService, TranslateService, LoginService, TtsService, DialogService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
