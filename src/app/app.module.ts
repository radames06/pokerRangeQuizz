import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { RangesComponent } from './ranges/ranges.component';
import { QuizzComponent } from './quizz/quizz.component';
import { FormsModule } from '@angular/forms';

const appRoutes: Routes = [
  { path: '',  redirectTo: '/', pathMatch: 'full' },
  { path: 'ranges', component: RangesComponent },
  { path: 'quizz', component: QuizzComponent },
  { path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RangesComponent,
    QuizzComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
    NgbCollapseModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
