import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { RangesService } from '../services/ranges.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  userMail: String;
  navbarOpen = false;

  constructor(private authService: AuthService, private rangeService: RangesService) { }

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.userMail = user ? user.email : "";
    });

  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
    this.rangeService.emptyRanges();
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
