import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { izm_plateji_doc_list, izm_plateji_doc, izm_plateji_detail, izm_plateji_table } from "./interfaces";
import { AuthService } from "src/app/login/auth.service"

@Injectable({
    providedIn: 'root'
})


export class IzmPlatezhiService {
    host = ""

    constructor(
        private http: HttpClient,
        private authservice: AuthService) {
        this.host = this.authservice.host;
    }

    fetch(params: any): Observable<izm_plateji_doc_list> {
        return this.http.post<izm_plateji_doc_list>(this.host + 'docs/izmexplist', params)
    }

    fetch_detail(izm_plateji: string): Observable<izm_plateji_detail> {
        return this.http.get<izm_plateji_detail>(this.host + `docs/izmexpitem/${izm_plateji}`)
    }

    get_ostatok_expenses(izm_plateji: any): Observable<izm_plateji_table> {
        return this.http.post<izm_plateji_table>(this.host + 'docs/expgetplanbyclassif', izm_plateji)
    }

    saveUtv(izm_plateji: izm_plateji_detail) {
        return this.http.post(this.host + 'docs/izmexpsave', izm_plateji)
    }

    deleteIzmPlatezhi(izm_platezhi_id: any) {
        return this.http.delete(this.host + 'docs/izmexpdelete', { body: izm_platezhi_id })
    }

    getReport2728(param: any) {
        return this.http.post(this.host + "reps/report2728", param, { responseType: 'blob' })
    }

    getReport2930(param: any) {
        return this.http.post(this.host + "reps/report2930", param, { responseType: 'blob' })
    }
}