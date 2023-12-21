import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/login/auth.service"
import { import552_detail, import552_list } from "./import552.interfaces";

@Injectable({
  providedIn: 'root'
})

export class import552Servise {

  host = ""

  constructor(
    private http: HttpClient,
    private authservice: AuthService) {
    this.host = this.authservice.host;
  }

  fetch(params: any): Observable<import552_list> {
    return this.http.get<import552_list>(this.host + 'docs/import552list', { params })
  }

  fetch_detail(imp_420_id: string, params: any): Observable<import552_detail> {
    return this.http.get<import552_detail>(this.host + `docs/import552item/${imp_420_id}`, { params })
  }

  delete_import552(imp_552: any) {
    return this.http.delete(this.host + 'docs/import552delete', { body: imp_552 })
  }
}
