import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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