import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ClassificationIncomeService } from '../classification-income.services';
import { classsification_income_detail } from '../interfaces';
import { CategoryIncomeComponent } from '../../income/category-income/category_income-list/category-income.component';
import { ClassIncomeListComponent } from '../../income/class-income/class-income-list/class-income-list.component';
import { PodclassListComponent } from '../../podclass/podclass-list/podclass-list.component';
import { SpecificationIncomeListComponent } from '../../specification-income/specification-income-list/specification-income-list.component';
import { CategoryIncomeDetailComponent } from '../../income/category-income/category-income-detail/category-income-detail.component';
import { ClassIncomeDetailComponent } from '../../income/class-income/class-income-detail/class-income-detail.component';
import { PodclassDetailComponent } from '../../podclass/podclass-detail/podclass-detail.component';
import { SpecificationIncomeDetailComponent } from '../../specification-income/specification-income-detail/specification-income-detail.component';

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
    private Select_dialog: DialogService,
    private Select_dialog_ref: DynamicDialogRef
  ) { }

  form: FormGroup
  // classifDetail$: Observable<classsification_income_detail>
  classif_id = ''
  classifDetail: classsification_income_detail

  ngOnInit(): void {
    this.form = new FormGroup({
      code: new FormControl(null, []),
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
        id: 0,
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

  addCategory() {
    this.Select_dialog_ref = this.Select_dialog.open(CategoryIncomeComponent,
      {
        header: 'Выбор категории',
        width: '70%',
        height: '50%'
      }
    )

    this.Select_dialog_ref.onClose.subscribe((category: any) => {
      if (category) {
        this.classifDetail._category_id = category.id;
        this.classifDetail.category_name = category.name_rus;
        this.classifDetail.category_code = category.code;
      }
    })
  }

  addClass() {
    this.Select_dialog_ref = this.Select_dialog.open(ClassIncomeListComponent,
      {
        header: 'Выбор класс',
        width: '70%',
        height: '50%'
      }
    )

    this.Select_dialog_ref.onClose.subscribe((classs: any) => {
      if (classs) {
        this.classifDetail._classs_id = classs.id;
        this.classifDetail.classs_name = classs.name_rus;
        this.classifDetail.classs_code = classs.code;
      }
    })
  }
  addPodclass() {
    this.Select_dialog_ref = this.Select_dialog.open(PodclassListComponent,
      {
        header: 'Выбор подкласс',
        width: '70%',
        height: '50%'
      }
    )

    this.Select_dialog_ref.onClose.subscribe((podcl: any) => {
      if (podcl) {
        this.classifDetail._podclass_id = podcl.id;
        this.classifDetail.podclass_name = podcl.name_rus;
        this.classifDetail.podclass_code = podcl.code;
      }
    })
  }

  addSpec() {
    this.Select_dialog_ref = this.Select_dialog.open(SpecificationIncomeListComponent,
      {
        header: 'Выбор подкласс',
        width: '70%',
        height: '50%'
      }
    )

    this.Select_dialog_ref.onClose.subscribe((specif: any) => {
      if (specif) {
        this.classifDetail._spec_id = specif.id;
        this.classifDetail.spec_name = specif.name_rus;
        this.classifDetail.spec_code = specif.code;
      }
    })
  }

  viewCategory(cat_inc_id: number) {
    let headertext = 'Создание категории'

    if (cat_inc_id !== 0) {
      headertext = 'Редактирование категории'
    }

    this.Select_dialog_ref = this.Select_dialog.open(CategoryIncomeDetailComponent,
      {
        header: headertext,
        width: '60%',
        height: '40%',
        data: { cat_id: cat_inc_id }
      })

    this.Select_dialog_ref.onClose.subscribe((save: boolean) => {
      if (save) {
        console.log(save);
        
      }
    })
  }

  viewClass(class_inc_id: number) {
    let headertext = 'Создание класс'
    
    if (class_inc_id !== 0) {
      headertext = 'Редактирование класс'
    }

    this.Select_dialog_ref = this.Select_dialog.open(ClassIncomeDetailComponent,
      {
        header: headertext,
        width: '60%',
        height: '40%',
        data: { cat_id: class_inc_id }
      })

    this.Select_dialog_ref.onClose.subscribe((save: boolean) => {
      if (save) {
        console.log(save);
        
      }
    })
  }

  viewPodclass() {

  }
  
  viewSpec() {

  }

  saveClassif() {
    if (this.classifDetail.id !== 0) 
    {
      this.ClassifDetailService.saveClass(this.classifDetail)
      .subscribe(
        (data) => {
          this.ClassifDetailmsg.add({ severity: 'success', summary: 'Успещно', detail: 'Классификация отредактирована' }),
          this.closeClassif(true)
        },
        (error) => {
          this.ClassifDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
        }
      )  
    }
    else {
      this.ClassifDetailService.addClass(this.classifDetail)
      .subscribe(
        (data) => {
        this.ClassifDetailmsg.add({ severity: 'success', summary: 'Успещно', detail: 'Классификация сохранена' })
      },
      (error)=> {
        this.ClassifDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status });
      })
    }
    
  }

  closeClassif(saved:boolean) {
      this.Select_dialog_ref.close(saved)
  }
}
