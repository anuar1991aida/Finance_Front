import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ClassificationIncomeService } from '../classification-income.services';
import { classsification_income_detail } from '../interfaces';

@Component({
  selector: 'app-classification-income-detail',
  templateUrl: './classification-income-detail.component.html',
  styleUrls: ['./classification-income-detail.component.css']
})
export class ClassificationIncomeDetailComponent implements OnInit {

  constructor(
    private ClassifDetailService: ClassificationIncomeService,
    private ClassifDetailmsg: MessageService,
    private ClassifDetailconfig: DynamicDialogConfig,
    private ClassifDetailconfirm: ConfirmationService,
  ) { }

  form: FormGroup
  // classifDetail$: Observable<classsification_income_detail>
  classif_id = ''
  classifDetail: classsification_income_detail

  ngOnInit(): void {
    this.form = new FormGroup({
      code: new FormControl(null, [Validators.required]),
      name_kaz: new FormControl(null, [Validators.required]),
      name_rus: new FormControl(null, [Validators.required]),
      category_name: new FormControl(null, [Validators.required]),
      classs_name: new FormControl(null, [Validators.required]),
      podclass_name: new FormControl(null, [Validators.required]),
      spec_name: new FormControl(null, [Validators.required])
    })

    this.classif_id = this.ClassifDetailconfig.data.classif_id

    if (this.classif_id == '') {
      this.classifDetail = {
        id: '',
        code: '',
        name_kaz: '',
        name_rus: '',
        _category_id: 0,
        category_code: '',
        category_name: '',
        _classs_id: 0,
        classs_code: '',
        classs_name: '',
        _podclass_id: 0,
        podclass_code: '',
        podclass_name: '',
        _spec_id: 0,
        spec_code: '',
        spec_name: ''
      }
    }
    else {
      this.ClassifDetailService.fetch_detail(this.classif_id)
        .subscribe(
          (classifDetail) => (this.classifDetail = classifDetail)
        )
    }
  }

  addClassification() {

  }

  viewClassification() {

  }

  saveClassif() {

  }

  closeClassif() {

  }
}
