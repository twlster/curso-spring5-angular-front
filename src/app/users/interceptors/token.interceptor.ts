import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import {AuthService} from '../auth.service';

import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      let token = this.authService.token;

      if(token != null && token != ''){
        const authReq = req.clone({
          headers: req.headers.set('Authorization', 'Bearer '+token)
        });
        return next.handle(authReq);
      }

    return next.handle(req);
  }
}
