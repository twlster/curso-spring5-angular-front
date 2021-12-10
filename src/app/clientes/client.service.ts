import { Injectable } from '@angular/core';
import { formatDate, DatePipe, registerLocaleData} from '@angular/common';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
// import {AuthService} from '../users/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private urlEndpoint:string = 'http://localhost:8080/api/clients';

  // private httpHeader = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient, private router: Router) { }
  // private addAuthorizationHeader(){
  //   let token = this.authService.token;
  //   if(token != null){
  //     return this.httpHeader.append('Authorization', 'Bearer '+token);
  //   }
  //   return this.httpHeader;
  // }

  getPagedClients(page: number): Observable<any> {
     return this.http.get(`${this.urlEndpoint}/page/${page}`).pipe(
       map( (response :any) => {
         (response.content as Cliente[]).map(cliente => {
          cliente.name = cliente.name.toUpperCase();
        //  cliente.birthDate = new DatePipe('es').transform(cliente.birthDate, 'EEEE dd, MMMM, yyyy');
          return cliente;
         });
         return response;
       })
      );
   }

  getClients(): Observable<Cliente[]> {
     return this.http.get(this.urlEndpoint).pipe(
       map(response => {
         let clientes = response as Cliente[];
         return clientes.map(cliente => {
          cliente.name = cliente.name.toUpperCase();
        //  cliente.birthDate = new DatePipe('es').transform(cliente.birthDate, 'EEEE dd, MMMM, yyyy');
          return cliente;
         });
       })
      );
   }

  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndpoint, cliente).pipe(
      catchError(e => {
        if(e.status == 400){
            return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente) : Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlEndpoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if(e.status == 400){
            return throwError(e);
        }
        console.error(e.error.mensaje);
        return throwError(e);

      })
    );
  }

  getCliente(id: string) : Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if(e.status != 401){
          this.router.navigate(['/clientes']);
        }
        return throwError(e);
      })
    );
  }

  deleteCliente(cliente: Cliente) : Observable<Cliente>{
    return  this.http.delete<Cliente>(`${this.urlEndpoint}/${cliente.id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  uploadPicture(file: File, id: number) : Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("file", file);
    formData.append("id", ""+id);

    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

}
