import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/login/auth.service"

@Injectable({
    providedIn: 'root'
})

export class ReportService {
    host = ""

    constructor(
        private http: HttpClient,
        private authservice: AuthService) {
        this.host = this.authservice.host;
    }

    getReport2_5(param: any) {
        return this.http.post(this.host + "reps/report2_5", param, { responseType: 'blob' })
    }

    getReport27_28(param: any) {
        return this.http.post(this.host + "reps/report2728", param, { responseType: 'blob' })
    }

    getReport29_30(param: any) {
        return this.http.post(this.host + "reps/report2930", param, { responseType: 'blob' })
    }
}