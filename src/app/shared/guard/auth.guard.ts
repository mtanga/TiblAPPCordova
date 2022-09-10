import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../../shared/services/data/auth.service";
import { ProfileService } from "../../shared/services/data/profile.service";
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user: any = [];
  
  constructor(
    public authService: AuthService,
    public profileService: ProfileService,
    public router: Router
  ){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.isLoggedIn == true) {
      return true;
    }
    else{
      this.router.navigate(['sign-in'])
    }
    
  }


}