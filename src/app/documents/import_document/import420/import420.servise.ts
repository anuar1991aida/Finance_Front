import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class import420Servise {

  constructor(private http: HttpClient) {
  }

  host = "http://192.168.5.27:8000/"

  send_file() {
    return this.http.get(this.host + "docs/import420")
  }
}
