import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailNg: String;
  passwordNg: String;
  error: String;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
      let authObs: Observable<AuthResponseData>;

      authObs = this.authService.signIn(this.emailNg, this.passwordNg);
      authObs.subscribe(
        resData => {
          this.router.navigate(['/ranges']);
        },
        error => {
          this.error = error;
        }
      )
    }
  
}
