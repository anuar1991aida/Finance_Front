import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { category_income_detail, category_income_list } from "./interfaces";

@Injectable({
    providedIn: 'root'
})


export class CategoryIncomeService {
    constructor(private http: HttpClient) {
    }
    host = "http://192.168.10.237:8000/"


    fetch(params: any): Observable<category_income_list> {
        return this.http.get<category_income_list>(this.host + 'dirs/categorylist', { params })
    }

    saveCategory(category: category_income_detail) {
        return this.http.post(this.host + 'dirs/categoryedit', category)
    }

    addCategory(category: category_income_detail) {
        return this.http.post(this.host + 'dirs/categoryadd', category)
    }

    deleteCategory(category_id: string = '') {
        return this.http.delete(this.host + 'dirs/categorydelete/' + category_id)
    }
}