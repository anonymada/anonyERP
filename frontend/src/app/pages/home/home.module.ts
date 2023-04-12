import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../modules/app.shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SharedModule,
    HomePageRoutingModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule { }
