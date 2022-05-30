import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public onLogout: EventEmitter<any> = new EventEmitter<any>();

  private identity: any;
  private token: string;
  private personation_token: string;

  constructor() {
    this.identity = this.getPayload(this.getToken());
    this.personation_token = this.getToken();
  }

  isAuthenticate(): boolean {
    ///console.log(this.token || localStorage.getItem('token'))
    return !!(this.token || localStorage.getItem('token'));
  }

  getIdentity() {
    return this.identity;
  }

  setIdentity(identity: any): void {
    this.identity = identity;
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    this.impersonate(token);
    if (!token) {
      localStorage.removeItem('token');
      return;
    }
    localStorage.setItem('token', token);
  }

  getPayload(token: string): any {
    if (!token) return {};
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  hasRoles(roles: string[]): boolean {
    //return true;
    if (!this.getToken()) return false;

    let user_roles: string[] = [];

    if (this.identity) {
      user_roles = this.identity.roles || [];
    } else {
      let payload = this.getPayload(this.getToken());
      if (payload) {
        user_roles = payload.roles || [];
      }
    }
    return !!user_roles.find((ur) => roles.find((r) => r == ur));
  }

  impersonate(token: string): void {
    this.personation_token = token;
  }

  getPersonation(): string {
    return this.personation_token || this.getToken();
  }

  logout() {
    this.setToken(null);
    this.setIdentity(null);
    this.onLogout.emit(true);
  }
}
