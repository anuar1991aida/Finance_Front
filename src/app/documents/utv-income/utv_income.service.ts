import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { utv_income_detail, utv_income_list } from "./interfaces";

@Injectable({
    providedIn: 'root'
})


export class UtvIncomeService {
    constructor(private http: HttpClient) {
    }
    host = "http://192.168.10.237:8000/"


    fetch(params: any): Observable<utv_income_list> {
        return this.http.get<utv_income_list>(this.host + 'docs/utvinclist', { params })
    }

    fetch_detail(utv_inc_id: string): Observable<utv_income_detail> {
        return this.http.get<utv_income_detail>(this.host + 'dirs/utvincitem/' + utv_inc_id)
    }

    saveSpec(utv_inc: utv_income_detail) {
        return this.http.post(this.host + 'dirs/specincedit', utv_inc)
    }

    addSpec(utv_inc: utv_income_detail) {
        return this.http.post(this.host + 'dirs/specincadd', utv_inc)
    }

    deleteUtv(utv_inc_id: string = '') {
        return this.http.delete(this.host + 'dirs/specincdelete/' + utv_inc_id)
    }
}