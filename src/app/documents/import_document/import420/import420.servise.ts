import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/login/auth.service"
import { import420_detail, import420_list } from "./interfaces";

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

  fetch(params: any): Observable<import420_list> {
    return this.http.get<import420_list>(this.host + 'docs/import420list', { params })
  }

  fetch_detail(imp_420_id: string): Observable<import420_detail> {
    return this.http.get<import420_detail>(this.host + `docs/import420item/${imp_420_id}`)
  }

  delete_import420(imp_420: any) {
    return this.http.delete(this.host + 'docs/import420delete', { body: imp_420 })
  }
}
