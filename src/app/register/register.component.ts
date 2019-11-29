import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private emailNg: String;
  private passwordNg: String;
  private passwordConfirmNg: String;
  private error: String;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    let authObs: Observable<AuthResponseData>;
    authObs = this.authService.signUp(this.emailNg, this.passwordNg);
      authObs.subscribe(
        resData => {
          this.router.navigate(['/login']);
        },
        error => {
          this.error = error;
        }
      )
  }
}
