import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryIncomeService } from '../category_income.service';
import { category_income_list } from '../interfaces';



@Component({
  selector: 'app-category-income',
  templateUrl: './category-income.component.html',
  styleUrls: ['./category-income.component.css']
})
export class CategoryIncomeComponent implements OnInit {

  constructor(private categoryService: CategoryIncomeService) { }

  category$: Observable<category_income_list>
  first = 0
  rows = 3
  last = 3

  ngOnInit(): void {
    this.fetchCat()
  }

  fetchCat() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.category$ = this.categoryService.fetch(params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchCat()
  }



}
