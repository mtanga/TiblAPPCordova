import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffercomponentPageRoutingModule } from './offercomponent-routing.module';

import { OffercomponentPage } from './offercomponent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffercomponentPageRoutingModule
  ],
  declarations: [OffercomponentPage]
})
export class OffercomponentPageModule {}
