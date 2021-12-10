import { Component, OnInit } from '@angular/core';
import {User} from './user';
import swal from 'sweetalert2';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  tittle:string = "Please Sing In!";
  user: User;

  constructor(private authService: AuthService, private router: Router) {
    this.user = new User();
  }

  ngOnInit() {
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/clientes']);
      let user = this.authService.user;
      swal.fire('Login', `Welcome back ${user.name} ${user.lastName}`, 'info');
    }
  }

  login():void{
    console.log(this.user);
    if(this.user.username == null || this.user.username == '' || this.user.password == null || this.user.password == ''){
      swal.fire('Login Error', 'Empty username or password', 'error');
      return;
    }

    this.authService.login(this.user).subscribe(response => {

      this.authService.saveUser(response);
      this.authService.saveToken(response.access_token);

      this.router.navigate(['/clientes']);
      swal.fire('Greetings!', `Greetings ${this.authService.user.name} ${this.authService.user.lastName}, session iniciated successfully.`, 'success');

    }, err => {
      if(err.status == 400){
        swal.fire('Error', `Incorrect user or password.`, 'error');
      }
    });

  }

}
