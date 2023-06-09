import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ClassificationIncomeDetailComponent } from '../classification-income-detail/classification-income-detail.component';
import { ClassificationIncomeService } from '../classification-income.services';
import { classsification_income_detail, classsification_income_list, classsification_income } from '../interfaces';

@Component({
  selector: 'app-classification-income-list',
  templateUrl: './classification-income-list.component.html',
  styleUrls: ['./classification-income-list.component.css']
})
export class ClassificationIncomeListComponent implements OnInit {

  constructor(
    private classifService: ClassificationIncomeService,
    private classifref: DynamicDialogRef,
    private classifconfirm: ConfirmationService,
    private classifListdialog: DialogService,
    private classifListmessage: MessageService,
  ) { }

  classif$: Observable<classsification_income_list>
  NewClassif: classsification_income_detail = {
    id: '',
    code: '',
    name_kaz: '',
    name_rus: '',
    category: '',
    classs: '',
    podclass: '',
    spec: ''
  }
  searchclassif = ''
  first = 0
  rows = 3

  ngOnInit(): void {
    this.fetchClassif()
  }

  fetchClassif() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.classif$ = this.classifService.fetch(params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchClassif()
  }

  onRowEdit(classif_inc_id: string) {
    let headertext = 'Редактирование классификации'

    if (classif_inc_id !== '') {
      headertext = 'Создание классификации'
    }

    this.classifref = this.classifListdialog.open(ClassificationIncomeDetailComponent,
      {
        header: headertext,
        width: '60%',
        height: '40%',
        data: { classif_id: classif_inc_id }
      })

    this.classifref.onClose.subscribe((save: boolean) => {
      if (save) {
        this.fetchClassif()
      }
    })
  }

  onDelete(classif_inc: classsification_income) {
    this.classifconfirm.confirm({
      message: 'Вы действительно хотите удалить ' + classif_inc.code + '?',
      header: 'Удаление классификации',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.classifService.deleteClass(classif_inc.id)
          .subscribe((data) => (
            this.classifListmessage.add({ severity: 'success', summary: 'Успешно', detail: 'Классификация удалена!' }),
            this.fetchClassif(), this.classifconfirm.close()),
            (error) => (this.classifListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить классификацию!' }))
          )
      },
      reject: () => {
        this.classifconfirm.close();
      }
    });
  }

  search() {

  }

}
