import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const target = new URL(request.url, window.location.href);
        const api = new URL(environment.apiBaseUrl, window.location.href);
        const basePath = api.pathname.endsWith('/') ? api.pathname : api.pathname + '/';
        if (target.origin !== api.origin || !(target.pathname === api.pathname.replace(/\/$/, '') || target.pathname.startsWith(basePath))) {
            return next.handle(request);
        }
        const token = localStorage.getItem("token");
        const headers = {};
        const coords = localStorage.getItem("coords")
        if (token) headers['Authorization'] = `${token}`;
        if (coords) headers['X-Location'] = btoa(`${coords}`);
        //headers['Client-Type'] = 'AP';

        request = request.clone({
            setHeaders: headers
        });

        return next.handle(request);
    }
}
