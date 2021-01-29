import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DynamicService } from '../lib/dynamic-forms/decorators/dynamic-service.decorator';
import { User } from '../models/user.model';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
@DynamicService()
export class UsersService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  login(user: User) {
    return this.http.post(`${Global.ENDPOINTS.BASE}/login`, user).toPromise()
      .then((res: { token: string, user: User }) => {
        this.auth.setIdentity(res.user);
        this.auth.setToken(res.token);
      })
  }

  signIn(user: User) {
    return this.http.post(`${Global.ENDPOINTS.BASE}/sign-in`, user).toPromise()
      .then((res: { token: string, user: User }) => {
        this.auth.setIdentity(res.user);
        this.auth.setToken(res.token);
      })
  }
}
