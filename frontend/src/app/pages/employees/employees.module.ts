import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EmployeesPageRoutingModule } from './employees-routing.module';
import { EmployeesPage } from './employees.page';
import { SharedModule } from '../../modules/app.shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    EmployeesPageRoutingModule
  ],
  declarations: [EmployeesPage]
})
export class EmployeesPageModule { }
