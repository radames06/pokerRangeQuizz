import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { RangesComponent } from './ranges/ranges.component';
import { QuizzComponent } from './quizz/quizz.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PasswordsIdenticalValidatorDirective } from './services/passwordsIdentical.directive';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './services/auth.gard';
import { ResultsComponent } from './results/results.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

const appRoutes: Routes = [
  { path: '',  redirectTo: '/home', pathMatch: 'full' },
  { path: 'ranges', component: RangesComponent, canActivate: [AuthGuard] },
  { path: 'quizz', component: QuizzComponent, canActivate: [AuthGuard] },
  { path: 'results', component: ResultsComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '/home'}
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RangesComponent,
    QuizzComponent,
    RegisterComponent,
    LoginComponent,
    PasswordsIdenticalValidatorDirective,
    ResultsComponent,
    HomeComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
    NgbCollapseModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
