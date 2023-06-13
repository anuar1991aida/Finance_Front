import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { izm_inc_doc_tab , izm_inc_doc , izm_inc_doc_detail ,izm_inc_doc_list} from '../izm_inc_doc/interfaces';



@Injectable({
  providedIn: 'root'
})


export class Doc_izm_Servis {
  constructor(private http: HttpClient) {
  }
  host = "http://192.168.10.237:8000/"


  fetch(params: any): Observable<izm_inc_doc_list> {
      return this.http.get<izm_inc_doc_list>(this.host + 'docs/izminclist', { params })
  }
}
