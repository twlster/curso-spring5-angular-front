import { Injectable } from '@angular/core';
import { Region } from './region';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../users/auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  private urlEndpoint:string = 'http://localhost:8080/api/clients/regions';

  // private httpHeader = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  // private addAuthorizationHeader(){
  //   let token = this.authService.token;
  //   if(token != null){
  //     return this.httpHeader.append('Authorization', 'Bearer '+token);
  //   }
  //   return this.httpHeader;
  // }

  getRegions(): Observable<Region[]> {
     return this.http.get(this.urlEndpoint
    //   , {headers: this.addAuthorizationHeader()}
     ).pipe(
       map(response => {
         return response as Region[];
       }),
       catchError(e => {
         this.isNotAuthorized(e);
         return throwError(e);
       })
      );
   }

   private isNotAuthorized(e): boolean{
     if(e.status === 401){

       if(this.authService.isAuthenticated()){
         this.authService.logout();
       }

       this.router.navigate(['/login'])
       return true;
     }else if(e.status===403){
     swal.fire('Access Denied', `Dear ${this.authService.user.name} ${this.authService.user.lastName}, you don't have access to this action.`, 'warning');
       this.router.navigate(['/clientes'])
       return true;
     }else{
       return false;
     }
   }
}
