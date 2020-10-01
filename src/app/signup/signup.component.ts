import { Component, OnInit } from '@angular/core';
import { TokenPayload } from '../core/definitions/TokenPayload';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {

  credentials: TokenPayload = new TokenPayload();

  constructor(private authService:AuthService, private toastService: ToastService) { }

  ngOnInit(): void {
  }

  register(){
    this.authService.register(this.credentials).subscribe(() => {

    }, err => {
      this.toastService.showDanger("Registration failed");
    });
  }


}
