import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { func_group_detail, func_group_list } from "./interfaces";

@Injectable({
    providedIn: 'root'
})


export class FuncGroupService {
    constructor(private http: HttpClient) {
    }
    host = "http://192.168.10.237:8000/"


    fetch(params: any): Observable<func_group_list> {
        return this.http.get<func_group_list>(this.host + 'dirs/funcgrouplist', { params })
    }

}