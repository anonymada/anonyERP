
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  constructor() { }

  ngOnInit() { }

  refresh(event) {
    setTimeout(async () => {
      event.target.complete();
    }, 500);
  }

}
