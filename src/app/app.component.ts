import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public router: Router,
    private splashScreen: SplashScreen,
    private platform: Platform,
  ) {

    this.initializeApp();
    if(localStorage.getItem('ready')==null){
       // router.navigate(['onboard']);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.hideSplashScreen();
    });
      }
      hideSplashScreen() {
        if (this.splashScreen) {
          setTimeout(() => {
            this.splashScreen.hide();
          }, 3000);
        }
      }
}
