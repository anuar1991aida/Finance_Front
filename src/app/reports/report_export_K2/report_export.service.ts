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

    getreport_export(param: any) {
        return this.http.post(this.host + "reps/report_export_K2", param, { responseType: 'blob' })
    }

    getreport_export_exl(param: any) {
        return this.http.post(this.host + "reps/report_export_K2", param, { responseType: 'blob' })
            .subscribe(blob => {
                const a = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = 'Экспорт в казначейство.xlsx';
                a.click();
                URL.revokeObjectURL(objectUrl);
            })
    }
}