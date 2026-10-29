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
  public isDesktop = false;
  public isLoggedIn = false;

  constructor(public user: UserService) {
  }

  ngOnInit() { }

  get appPages() {
    return AppConstants.appPages.filter((page) =>
      page.roles.includes('*') ||
      page.roles.includes('admin') && this.user.isAdmin ||
      page.roles.includes('moderator') && this.user.isModerator ||
      page.roles.includes('user') && this.user.isUser
    );
  }

  logout() {
    this.user.logout();
  }

}
