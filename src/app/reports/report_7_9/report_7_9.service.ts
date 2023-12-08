import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/login/auth.service"

@Injectable({
    providedIn: 'root'
})

export class report_7_9_Service {
    host = ""

    constructor(
        private http: HttpClient,
        private authservice: AuthService) {
        this.host = this.authservice.host;
    }

    getReport7_9(param: any) {
        return this.http.post(this.host + "reps/report_7_9", param, { responseType: 'blob' })
    }
}