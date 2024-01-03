import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/login/auth.service"
import { import127_detail, import127_list } from "./interfaces";

@Injectable({
  providedIn: 'root'
})

export class import127Servise {

  host = ""

  constructor(
    private http: HttpClient,
    private authservice: AuthService) {
    this.host = this.authservice.host;
  }

  fetch(params: any): Observable<import127_list> {
    return this.http.get<import127_list>(this.host + 'docs/import127list', { params })
  }

  fetch_detail(imp_127_id: string, params: any): Observable<import127_detail> {
    return this.http.get<import127_detail>(this.host + `docs/import127item/${imp_127_id}`, { params })
  }

  delete_import127(imp_127: any) {
    return this.http.delete(this.host + 'docs/import127delete', { body: imp_127 })
  }
}
