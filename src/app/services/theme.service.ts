import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(
    private domController: DomController,
    @Inject(DOCUMENT) private document
  ) {}

  toggleTheme() {
    this.domController.write(() => {
      this.document.body.classList.toggle('dark');
    });
  }
}
