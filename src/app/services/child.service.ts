import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})


export class ChildsService {
    constructor(private http: HttpClient) {

    }

    fetch() {
        this.http.get('/api/childlist')
    }

}