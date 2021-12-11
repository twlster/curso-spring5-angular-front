import { Injectable } from '@angular/core';
import { formatDate, DatePipe, registerLocaleData} from '@angular/common';
import { Bill } from '../models/bill';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

private urlEndpoint: string = 'http://localhost:8080/api/bills';

  constructor(private http: HttpClient, private router: Router) { }

  getCliente(id: string) : Observable<Bill>{
    return this.http.get<Bill>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if(e.status != 401){
          this.router.navigate(['/bills']);
        }
        return throwError(e);
      })
    );
  }

 create(bill: Bill) : Observable<Bill>{
   return this.http.post<Bill>(this.urlEndpoint, bill).pipe(
     catchError(e => {
       if(e.status == 400){
           return throwError(e);
       }
       return throwError(e);
     })
   );
 }

 update(bill: Bill) : Observable<Bill>{
   return this.http.put<Bill>(`${this.urlEndpoint}/${bill.id}`, bill).pipe(
     catchError(e => {
       if(e.status == 400){
           return throwError(e);
       }
       console.error(e.error.mensaje);
       return throwError(e);

     })
   );
 }

 deleteCliente(bill: Bill) : Observable<Bill>{
   return  this.http.delete<Bill>(`${this.urlEndpoint}/${bill.id}`).pipe(
     catchError(e => {
       return throwError(e);
     })
   );
 }
}
