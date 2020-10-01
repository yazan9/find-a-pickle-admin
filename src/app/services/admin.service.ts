import { Injectable } from '@angular/core';
import { TokenPayload } from '../core/definitions/TokenPayload';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private env = environment;

  constructor(private http: HttpClient) { }
  
}
