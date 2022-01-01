import { Component } from '@angular/core';
import {AuthService} from '../users/auth.service';
import swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavBarComponent {

  tittle: string = 'App Angular';

  constructor(public authService: AuthService, private router: Router){}

  logout():void{
    this.authService.logout();
    swal.fire('Logout', `Logged out successfully.`, 'info');
    this.router.navigate(['/login']);
  }

}
