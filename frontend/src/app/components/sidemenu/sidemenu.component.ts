import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/config/app.constant';
import { UserService } from 'src/app/services/user/user-service';


@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})

export class SidemenuComponent implements OnInit {

  public selectedIndex = 0;
  public appPages = AppConstants.appPages;
  public isDesktop = false;
  public isLoggedIn = false;

  constructor(public user: UserService) {
  }

  ngOnInit() { }

  logout() {
    this.user.logout();
  }

}
