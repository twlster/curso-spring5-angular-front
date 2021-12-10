import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import {AuthService} from '../auth.service';
import swal from 'sweetalert2';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

import { Observable, throwError } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,  private router: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
     return next.handle(req).pipe(
       catchError(e => {
         if(e.status === 401){

           if(this.authService.isAuthenticated()){
             this.authService.logout();
           }
           this.router.navigate(['/login'])
         }

         if(e.status===403){
           swal.fire('Access Denied', `Dear ${this.authService.user.name} ${this.authService.user.lastName}, you don't have access to this action.`, 'warning');
           this.router.navigate(['/clientes'])
         }
         return throwError(e);
       })
     );
  }
}
