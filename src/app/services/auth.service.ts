import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenPayload } from '../core/definitions/TokenPayload';

export interface UserDetails {
  id: string;
  email: string;
  username: string;
  exp: number;
  isAdmin: boolean;
}

interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string
  private env = environment;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.baseUrl = `${this.env.backendUrl}/auth`;
  }

  private saveToken(token: string): void {
    sessionStorage.removeItem('fap-token');
    sessionStorage.setItem('fap-token', token);
  }

  public getToken(): string {
    return sessionStorage.getItem('fap-token');
  }

  public logout(): void {
    window.sessionStorage.removeItem('fap-token');
    this.router.navigateByUrl('/');
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    }
    else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return this.isTokenValid(user);
    }
    else {
      return false;
    }
  }

  private isTokenValid(user): boolean {
    return user.exp > Date.now() / 1000;
  }

  public isAdmin(): boolean {
    const user = this.getUserDetails();
    if (user && this.isLoggedIn()) {
      return user.isAdmin
    }
    else {
      return false;
    }
  }

  public register(user: TokenPayload): Observable<any> {
    return this.http.post(this.baseUrl + '/register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    let base = this.http.post(this.baseUrl + '/authenticate', user);
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }

  public getHeaders() {
    if (!this.isTokenValid(this.getUserDetails()))
      this.router.navigate(['/login'], { queryParams: { back: this.router.url } });
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    })
  }
}
