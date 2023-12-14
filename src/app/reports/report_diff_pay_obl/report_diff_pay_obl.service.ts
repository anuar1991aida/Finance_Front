import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/login/auth.service"

@Injectable({
    providedIn: 'root'
})

export class report_diff_pay_obl_Service {
    host = ""

    constructor(
        private http: HttpClient,
        private authservice: AuthService) {
        this.host = this.authservice.host;
    }

    getReport_diff_pay_obl(param: any) {
        return this.http.post(this.host + "reps/report_diff_pay_obl", param, { responseType: 'blob' })
    }
}