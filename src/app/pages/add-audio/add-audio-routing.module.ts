import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAudioPage } from './add-audio.page';

const routes: Routes = [
  {
    path: '',
    component: AddAudioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAudioPageRoutingModule {}
