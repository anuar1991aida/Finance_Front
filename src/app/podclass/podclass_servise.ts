import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { podclass_interfaces } from "./podclass_interfaces";

@Injectable({
    providedIn: 'root'
})


export class podclassService {
    constructor(private http: HttpClient) {
    }
    host = "http://192.168.10.237:8000/"


    fetch(params: any): Observable<podclass_interfaces> {
        return this.http.get<podclass_interfaces>(this.host + 'dirs/podclasslist', { params })
    }
}
