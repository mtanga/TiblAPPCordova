import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/data/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
  email : any;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  reset(){
    this.authService.ForgotPassword(this.email)
  }

}
