import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let role = next.data['role'] as string;

      if(!this.authService.isAuthenticated()){
        this.router.navigate(['/login']);
        return false;
      }

      if(this.authService.hasRole(role)){
        return true;
      }

      swal.fire('Access Denied', `Dear ${this.authService.user.name} ${this.authService.user.lastName}, you don't have access to this action.`, 'warning');
      this.router.navigate(['/clientes']);
      return false;

  }

}
