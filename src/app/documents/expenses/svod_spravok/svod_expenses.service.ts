import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { svod_expenses_detail, svod_expenses_doc, svod_expenses_list, svod_select_list } from "./interfaces";
import { AuthService } from "src/app/login/auth.service"

@Injectable({
    providedIn: 'root'
})


export class svodExpensesService {
    host = ""

    constructor(
        private http: HttpClient,
        private authservice: AuthService) {
        this.host = this.authservice.host;
    }

    fetch(params: any): Observable<svod_expenses_list> {
        return this.http.get<svod_expenses_list>(this.host + 'docs/svodexplist', { params })
    }

    fetch_select(limit: string, offset: string, params: any): Observable<svod_select_list> {
        return this.http.post<svod_select_list>(this.host + 'docs/izmexpselect?limit=' + limit + "&offset=" + offset, params)
    }

    fetch_detail(svod_exp_id: number): Observable<svod_expenses_detail> {
        return this.http.get<svod_expenses_detail>(this.host + `docs/svodexpitem/${svod_exp_id}`)
    }

    sendSvod(body: any) {
        return this.http.post(this.host + 'docs/svodexpchangestatus', body)
    }

    add_docs(svod_exp_id: number, docs: any): Observable<svod_expenses_detail> {
        return this.http.post<svod_expenses_detail>(this.host + `docs/svodexpitem/${svod_exp_id}/add`, docs)
    }

    delete_docs(svod_exp_id: number, docs: any): Observable<svod_expenses_detail> {
        return this.http.post<svod_expenses_detail>(this.host + `docs/svodexpitem/${svod_exp_id}/delete`, docs)
    }

    saveSvod(svod_inc: svod_expenses_doc) {
        return this.http.post(this.host + 'docs/svodexpadd', svod_inc)
    }

    deleteSvod(svod_inc: any) {
        return this.http.delete(this.host + 'docs/svodexpdelete', { body: svod_inc })
    }

    // getot4et() {
    //     return this.http.post(this.host + "reps/report2728", { responseType: 'blob' })
    //         .subscribe((data: any) => {
    //             let blob: any = new Blob([data], { type: 'application/pdf' });
    //             let url = window.URL.createObjectURL(blob);
    //             window.open(url);
    //         })
    // }

}