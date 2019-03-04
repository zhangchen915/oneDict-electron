import {HomeComponent} from './components/home/home.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TranslateComponent} from './components/translate/translate.component';
import {ConfigComponent} from './components/config/config.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, data: {state: 'home'}},
  {path: 'translate', component: TranslateComponent, data: {state: 'translate'}},
  {path: 'config', component: ConfigComponent, data: {state: 'config'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
