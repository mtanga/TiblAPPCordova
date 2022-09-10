import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffercomponentPage } from './offercomponent.page';

const routes: Routes = [
  {
    path: '',
    component: OffercomponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffercomponentPageRoutingModule {}
