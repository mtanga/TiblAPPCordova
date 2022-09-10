

import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
})
export class OnboardPage implements OnInit {

@ViewChild(IonSlides) slides: IonSlides;

  constructor() { }

  ngOnInit() {
  }

  next() {
    this.slides.slideNext();
  }

}
