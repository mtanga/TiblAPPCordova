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
