import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/login/auth.service"

@Injectable({
    providedIn: 'root'
})

export class report_diff_god_summ_Service {
    host = ""

    constructor(
        private http: HttpClient,
        private authservice: AuthService) {
        this.host = this.authservice.host;
    }

    getReport_report_diff_god_summ(param: any) {
        return this.http.post(this.host + "reps/report_diff_god_sum", param, { responseType: 'blob' })
    }
}