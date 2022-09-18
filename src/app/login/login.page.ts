import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/data/auth.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  password : any;
  email : any;

  constructor(
    public router: Router,
    public authService: AuthService,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}

term(){

  //window.open('https://newtec-ing.com/politique-de-confoidentialite/','popup','width=600,height=600');
  window.open('https://newtec-ing.com/politique-de-confoidentialite/', 'location=yes, toolbar=yes');
/*   const browser = this.iab.create('https://newtec-ing.com/politique-de-confoidentialite/');

    //browser.executeScript(...);

    browser.insertCSS({code:"body{background-color:white;}"});
    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
    });

    browser.close() */;
 }

register(){
  this.router.navigate(['/choose']);
}

reset(){
  this.router.navigate(['/reset']);
}

loginWithEmail(){
  this.authService.SignIn(this.email, this.password);
}

}
