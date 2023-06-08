import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { category_income_detail } from '../interfaces';

@Component({
  selector: 'app-category-income-detail',
  templateUrl: './category-income-detail.component.html',
  styleUrls: ['./category-income-detail.component.css']
})
export class CategoryIncomeDetailComponent implements OnInit {

  constructor(
    public CatDetailconfig: DynamicDialogConfig
  ) { }

  form: FormGroup
  category_detail: category_income_detail

  ngOnInit(): void {
    this.form = new FormGroup({
      code: new FormControl(null, [Validators.required]),
      name_kaz: new FormControl(null, [Validators.required]),
      name_rus: new FormControl(null, [Validators.required])
    })

    this.category_detail = this.CatDetailconfig.data.category
  }

}
