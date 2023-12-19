import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/login/auth.service"

@Injectable({
    providedIn: 'root'
})

export class report_16_18_Service {
    host = ""

    constructor(
        private http: HttpClient,
        private authservice: AuthService) {
        this.host = this.authservice.host;
    }

    getReport16_18(param: any) {
        return this.http.post(this.host + "reps/report_16_18", param, { responseType: 'blob' })
    }
}