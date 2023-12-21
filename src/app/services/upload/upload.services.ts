import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/login/auth.service"




@Injectable({
    providedIn: 'root'
})


export class uploadServise {

    host = ""

    constructor(
        private http: HttpClient,
        private authservice: AuthService) {
        this.host = this.authservice.host;
    }

    send_file_420(body: any) {
        return this.http.post(this.host + "docs/import420", JSON.stringify(body))
    }

    send_file_219(body: any) {
        return this.http.post(this.host + "docs/import219", JSON.stringify(body))
    }

    send_file_552(body: any) {
        return this.http.post(this.host + "docs/import552", JSON.stringify(body))
    }

}