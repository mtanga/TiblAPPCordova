import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewcomponentPageRoutingModule } from './newcomponent-routing.module';

import { NewcomponentPage } from './newcomponent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewcomponentPageRoutingModule
  ],
  declarations: [NewcomponentPage]
})
export class NewcomponentPageModule {}
