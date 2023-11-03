import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { pogashenie_kp_list } from './pogashenie-kp.interfaces';
import { AuthService } from "src/app/login/auth.service"


@Injectable({
    providedIn: 'root'
})


export class PogashenieKPService {

    host = ""

    constructor(private http: HttpClient,
        private authservice: AuthService) {
        this.host = this.authservice.host;
    }


    fetch(params: any): Observable<pogashenie_kp_list> {
        return this.http.get<pogashenie_kp_list>(this.host + 'dirs/repayinclist', { params })
    }

    // fetch_detail(izm_inc_id: string): Observable<izm_inc_doc_detail> {
    //     return this.http.get<izm_inc_doc_detail>(this.host + `docs/izmincitem/${izm_inc_id}`)
    // }

    // saveIzm(izm_inc: izm_inc_doc_detail) {
    //     return this.http.post(this.host + 'docs/izmincsave', izm_inc)
    // }

    // getOstatok(params: any): Observable<any> {
    //     return this.http.get<any>(this.host + 'docs/incgetplanbyclassif', { params })
    // }

    // deleteIzm(izm_inc_id: any) {
    //     return this.http.delete(this.host + 'docs/izmincdelete', { body: izm_inc_id })
    // }

    // gettypespr() {
    //     return this.http.get(this.host + 'dirs/typeincdoclist')
    // }
}