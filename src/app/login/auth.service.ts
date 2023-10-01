import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { observableToBeFn } from "rxjs/internal/testing/TestScheduler";
import { user_detail } from "../directory/user/interfaces";
import { User, body } from "./interfaces";

@Injectable({
    providedIn: 'root'
})


export class AuthService {

    constructor(
        private http: HttpClient) { }

    private auth_token = ''
    private tokken = ''

    host = "https://artback.qazna24.kz/"
    // host = "http://192.168.10.237:8000/"

    login(user: User): Observable<{ auth_token: string }> {
        return this.http.post<{ auth_token: string }>
            (this.host + 'api/auth/token/login', user)
            .pipe(
                tap(
                    ({ auth_token }) => {
                        // sessionStorage.setItem('auth-token', auth_token)
                        // this.setToken(auth_token)
                        this.tokken = auth_token
                    }
                )
            )
    }

    checkLogin(body: body) {
        return this.http.post(this.host + '/dirs/logineduser', body)
            .pipe(
                tap(
                    () => {
                        sessionStorage.setItem('auth-token', this.tokken)
                        this.setToken(this.tokken)
                    }
                )
            )
    }

    setToken(token: string) {
        this.auth_token = token
    }

    getToken(): string {
        return sessionStorage.getItem('auth-token') || ''
    }

    isAuthenticated(): boolean {
        return !!this.auth_token
    }

    logout(): Observable<any> {
        return this.http.post<any>
            (this.host + 'api/auth/token/logout', {})
            .pipe(
                tap(
                    () => {
                        this.setToken('')
                        this.tokken = ''
                        sessionStorage.clear()
                    }
                )
            )
    }

}