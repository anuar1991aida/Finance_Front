import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { classsification_income_detail, classsification_income_list, classsification_income } from "./interfaces";

@Injectable({
    providedIn: 'root'
})


export class ClassificationIncomeService {
    constructor(private http: HttpClient) {
    }
    host = "http://192.168.10.237:8000/"


    fetch(params: any): Observable<classsification_income_list> {
        return this.http.get<classsification_income_list>(this.host + 'dirs/classificationinclist', { params })
    }

    fetch_detail(classif_inc_id: string): Observable<classsification_income_detail> {
        return this.http.get<classsification_income_detail>(this.host + 'dirs/classlist/' + classif_inc_id)
    }

    saveClass(classif_inc: classsification_income_detail) {
        return this.http.post(this.host + 'dirs/classedit', classif_inc)
    }

    addClass(classif_inc: classsification_income_detail) {
        return this.http.post(this.host + 'dirs/classadd', classif_inc)
    }

    deleteClass(classif_inc_id: string = '') {
        return this.http.delete(this.host + 'dirs/classdelete/' + classif_inc_id)
    }
}