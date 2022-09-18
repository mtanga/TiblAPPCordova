import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-choose',
  templateUrl: './choose.page.html',
  styleUrls: ['./choose.page.scss'],
})
export class ChoosePage implements OnInit {

  constructor(
    public toastController: ToastController,
    public router: Router
  ) { }
  role : any;
  ngOnInit() {
  }

  onChange(event){
    //console.log(event);
    localStorage.setItem('role', event);
    ///console.log(this.role)

  }

  term(){
    //window.open('https://newtec-ing.com/politique-de-confoidentialite/','popup','width=600,height=600');
    window.open('https://newtec-ing.com/politique-de-confoidentialite/', 'location=yes, toolbar=yes');
   }

continue(){
  if(localStorage.getItem('role')==null){
    this.presentToast('Veuillez spécifier votre rôle pour continuer.')
  }
  else{
    this.router.navigate(['register']);
  }
}


  // send messages 
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

  login(){
    this.router.navigate(['login']);
  }
}
