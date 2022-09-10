import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../../shared/services/data/auth.service";
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  
  constructor(
    public authService: AuthService,
    public router: Router,
    public toastController: ToastController,
  ){ }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(JSON.parse(localStorage.getItem('user')).role == "client"){
      return true;
    }
    else{
      this.presentToast("Vous n'êtes pas autorisés à consulter cette ressource")
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
}