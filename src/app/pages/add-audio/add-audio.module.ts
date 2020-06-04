import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAudioPageRoutingModule } from './add-audio-routing.module';

import { AddAudioPage } from './add-audio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAudioPageRoutingModule
  ],
  declarations: [AddAudioPage]
})
export class AddAudioPageModule {}
