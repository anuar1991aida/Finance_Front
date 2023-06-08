import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { organization_list } from "./interfaces";

@Injectable({
    providedIn: 'root'
})


export class OrganizationsService {
    constructor(private http: HttpClient) {
    }
    host = "http://192.168.10.251:8000/"


    fetch(params: any): Observable<organization_list> {
        return this.http.get<organization_list>(this.host + 'api/orglist', { params })
    }
}