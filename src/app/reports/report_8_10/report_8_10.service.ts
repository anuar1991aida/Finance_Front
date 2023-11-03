import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/login/auth.service"

@Injectable({
    providedIn: 'root'
})

export class report_8_10_Service {
    host = ""

    constructor(
        private http: HttpClient,
        private authservice: AuthService) {
        this.host = this.authservice.host;
    }

    getReport8_10(param: any) {
        return this.http.post(this.host + "reps/report8_10", param, { responseType: 'blob' })
    }
}