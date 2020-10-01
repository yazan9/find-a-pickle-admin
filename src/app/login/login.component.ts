import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenPayload } from '../core/definitions/TokenPayload';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private toastService: ToastService) { }

  credentials: TokenPayload = new TokenPayload();

  ngOnInit(): void {
  }

  login(){
    this.authService.login(this.credentials).subscribe(() => {

    }, err => {
      this.toastService.showDanger("Login failed");
    });
  }

}
