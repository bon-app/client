import { HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { TokenInterceptor } from './token.interceptor';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';

describe('API credential boundaries', () => {
  beforeEach(() => localStorage.setItem('token', 'private-test-token'));
  afterEach(() => localStorage.removeItem('token'));
  function intercepted(url: string): HttpRequest<any> {
    let seen!: HttpRequest<any>;
    new TokenInterceptor({} as AuthService).intercept(new HttpRequest('POST', url, null), { handle: request => { seen = request; return of(new HttpResponse()); } });
    return seen;
  }
  it('authenticates requests to the configured API', () => {
    expect(intercepted(new URL('receipts', environment.apiBaseUrl).href).headers.get('Authorization')).toBe('private-test-token');
  });
  it('never attaches the token to signed uploads or similar-looking hosts', () => {
    expect(intercepted('https://storage.example.com/upload').headers.has('Authorization')).toBe(false);
    expect(intercepted(new URL(environment.apiBaseUrl).origin + '/another-app').headers.has('Authorization')).toBe(false);
  });
});
