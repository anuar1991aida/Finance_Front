import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../login/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService,
        private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.auth.isAuthenticated()) {
            req = req.clone({
                setHeaders: {
                    Authorization: 'Token ' + this.auth.getToken()
                }
            })
        }
        return next.handle(req).pipe(
            catchError(
                (error: HttpErrorResponse) => this.handleAuthError(error)
            )
        )
    }

    private handleAuthError(error: HttpErrorResponse): Observable<any> {
        if (error.status === 401) {
            // this.auth.setStorageToken(),
            this.router.navigate(['/login'],
                {
                    queryParams: {
                        sessionFailed: true
                    }
                })
        }

        return throwError(error)
    }

}