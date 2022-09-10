import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewcomponentPage } from './newcomponent.page';

const routes: Routes = [
  {
    path: '',
    component: NewcomponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewcomponentPageRoutingModule {}
