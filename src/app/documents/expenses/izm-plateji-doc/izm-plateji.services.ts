import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { izm_plateji_doc_list, izm_plateji_doc, izm_plateji_detail } from "./interfaces";
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
        return this.http.get<izm_plateji_doc_list>(this.host + 'docs/izmexplist', { params })
    }

    fetch_detail(izm_plateji: string): Observable<izm_plateji_detail> {
        return this.http.get<izm_plateji_detail>(this.host + `docs/izmexpitem/${izm_plateji}`)
    }

    // saveUtv(utv_inc: utv_expenses_detail) {
    //     return this.http.post(this.host + 'docs/utvexpsave', utv_inc)
    // }

    deleteIzmPlatezhi(izm_platezhi_id: number = 0) {
        return this.http.delete(this.host + `docs/izmexpdelete/${izm_platezhi_id}`)
    }
}