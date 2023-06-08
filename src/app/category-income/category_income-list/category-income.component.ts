import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { CategoryIncomeDetailComponent } from '../category-income-detail/category-income-detail.component';
import { CategoryIncomeService } from '../category_income.service';
import { category_income_detail, category_income_list } from '../interfaces';



@Component({
  selector: 'app-category-income',
  templateUrl: './category-income.component.html',
  styleUrls: ['./category-income.component.css']
})
export class CategoryIncomeComponent implements OnInit {

  constructor(
    private categoryService: CategoryIncomeService,
    private categoryref: DynamicDialogRef,
    private categoryconfirm: ConfirmationService,
    private categoryListdialog: DialogService,
    private categoryListmessage: MessageService,
  ) { }

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

  onRowEdit(cat: category_income_detail) {

    this.categoryref = this.categoryListdialog.open(CategoryIncomeDetailComponent,
      {
        header: 'Редактирование категории',
        width: '60%',
        height: '40%',
        data: { category: cat }
      });
  }


}
