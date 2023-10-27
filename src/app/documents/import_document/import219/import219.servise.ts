import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/login/auth.service"
import { import219_detail, import219_list } from "./interfaces";




@Injectable({
  providedIn: 'root'
})


export class import219Servise {

  host = ""

  constructor(
    private http: HttpClient,
    private authservice: AuthService) {
    this.host = this.authservice.host;
  }

  fetch(params: any): Observable<import219_list> {
    return this.http.get<import219_list>(this.host + 'docs/import219list', { params })
  }

  fetch_detail(imp_219_id: string): Observable<import219_detail> {
    return this.http.get<import219_detail>(this.host + `docs/import219item/${imp_219_id}`)
  }

  delete_import219(imp_219: any) {
    return this.http.delete(this.host + 'docs/import219delete', { body: imp_219 })
  }

}
