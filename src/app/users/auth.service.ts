import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from './user';

import {URL_BACKEND} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: User;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get user(): User{
    if(this._user != null){
      return this._user;
    } else if(this._user == null && sessionStorage.getItem('user') != null){
      this._user = JSON.parse(sessionStorage.getItem('user')) as User;
      return this._user;
    } else {
      return new User();
    }
  }

  public get token(): string{
    if(this._token != null){
      return this._token;
    } else if(this._token == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token');
      return this._token;
    } else {
      return '';
    }
  }

  login(user:User): Observable<any>{
    const url = URL_BACKEND+'/oauth/token';

    const credentials = btoa('angularApp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
                                         'Authorization': 'Basic '+credentials});

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', user.username);
    params.set('password', user.password);

    return this.http.post<any>(url, params.toString(), {headers: httpHeaders});
  }

  logout():void{
    this._token=null;
    this._user=null;
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  }

  saveUser(response: any): void{
    let payLoad = this.getToken(response.access_token);

    this._user = new User();
    this._user.name = payLoad.user_name;
    this._user.lastName = payLoad.user_lastname;
    this._user.email = payLoad.user_email;
    this._user.username = response.user_username;
    this._user.roles = payLoad.authorities;
    sessionStorage.setItem('user', JSON.stringify(this._user));
  }

  saveToken(accessToken: string): void{
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  getToken(accessToken: string):any{
    return  accessToken != null && accessToken.length > 0 ? JSON.parse(atob(accessToken.split(".")[1])) : null;
  }

  isAuthenticated(): boolean{
    let payLoad = this.getToken(this.token);
    return payLoad != null && payLoad.user_name != null  && payLoad.user_name.length>0;
  }

  hasRole(role: string): boolean{
    return this.user.roles.includes(role);
  }


}
