import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/login/auth.service"

@Injectable({
  providedIn: 'root'
})

export class import420Servise {

  host = ""

  constructor(
    private http: HttpClient,
    private authservice: AuthService) {
    this.host = this.authservice.host;
  }

  send_file() {
    return this.http.get(this.host + "docs/import420")
  }
}
