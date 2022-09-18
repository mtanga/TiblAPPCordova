import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/data/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  password : any;
  email : any;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(
    public authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  term(){
   // window.open("https://newtec-ing.com/politique-de-confoidentialite/", "_parent");
    window.open('https://newtec-ing.com/politique-de-confoidentialite/','popup','width=600,height=600');
  }

  registerWithEmail(){
    //if()
    this.authService.SignUp(this.email, this.password);
  }

  login(){
    this.router.navigate(['/login']);
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}

}
