import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClassificationIncomeDetailComponent } from 'src/app/directory/classification-income/classification-income-detail/classification-income-detail.component';
import { ClassificationIncomeListComponent } from 'src/app/directory/classification-income/classification-income-list/classification-income-list.component';
import { izm_inc_doc_detail } from '../interfaces';
import { IzmIncomeService } from '../izm_income.service';

@Component({
  selector: 'app-izm-inc-doc-detail',
  templateUrl: './izm-inc-doc-detail.component.html',
  styleUrls: ['./izm-inc-doc-detail.component.css']
})
export class IzmIncDocDetailComponent implements OnInit {

  constructor(
    private izmDetailService: IzmIncomeService,
    private izmDetailmsg: MessageService,
    private izmDetailref: DynamicDialogRef,
    private izmDetaildialog: DialogService,
    private izmDetailconfirm: ConfirmationService,
  ) { }

  @Input() izm_inc_id = ''
  @Output() closeEvent = new EventEmitter<any>()

  items: MenuItem[];
  form: FormGroup
  izmDetail: izm_inc_doc_detail
  responce: any

  ngOnInit(): void {
    this.form = new FormGroup({
      number_doc: new FormControl(null, [Validators.required]),
      date_doc: new FormControl(null, [Validators.required]),
      org_name: new FormControl(null, [Validators.required]),
      budjet_name: new FormControl(null, [Validators.required])
    })

    if (this.izm_inc_id !== '') {
      this.izmDetailService.fetch_detail(this.izm_inc_id)
        .subscribe(
          (detail) => {
            this.izmDetail = detail
          }
        )
    }
    else {
      this.izmDetail = {
        doc: {
          nom: '',
          _date: '',
          deleted: false,
          _organization: 0,
          org_name: '',
          _budjet: 0,
          budjet_name: '',
          _type_izm_doc: 0,
          type_izm_name: ''
        },
        tbl1: [{
          id: 0,
          tip: '',
          sm1: 0,
          sm2: 0,
          sm3: 0,
          sm4: 0,
          sm5: 0,
          sm6: 0,
          sm7: 0,
          sm8: 0,
          sm9: 0,
          sm10: 0,
          sm11: 0,
          sm12: 0,
          _classification: 0,
          classification_name: ''
        }]
      }

      this.izmDetail.tbl1.splice(0, this.izmDetail.tbl1.length)
    }

  }

  editClassification(id: number) {
    this.izmDetailref = this.izmDetaildialog.open(ClassificationIncomeListComponent,
      {
        header: 'Выбор классификации',
        width: '60%',
        height: '80%'
      })

    this.izmDetailref.onClose.subscribe((classific: any) => {
      if (classific) {
        let targetRow = this.izmDetail.tbl1.find((row) => row.id = id)
        if (targetRow) {
          targetRow._classification = classific.id
          targetRow.classification_name = classific.code + ' ' + classific.name_rus
        }
      }
    })
  }

  viewClassification(classif_inc_id: number) {
    this.izmDetailref = this.izmDetaildialog.open(ClassificationIncomeDetailComponent,
      {
        header: 'Редактирование классификации',
        width: '60%',
        height: '40%',
        data: { classif_id: classif_inc_id }
      })

  }

  addClassification() {

    this.izmDetailref = this.izmDetaildialog.open(ClassificationIncomeListComponent,
      {
        header: 'Выбор классификации',
        width: '60%',
        height: '80%'
      })

    this.izmDetailref.onClose.subscribe((classific: any) => {
      if (classific) {
        this.izmDetail.tbl1.push(
          {
            _classification: classific.id,
            classification_name: classific.code + ' ' + classific.name_rus,
            id: 0,
            tip: '',
            sm1: 0,
            sm2: 0,
            sm3: 0,
            sm4: 0,
            sm5: 0,
            sm6: 0,
            sm7: 0,
            sm8: 0,
            sm9: 0,
            sm10: 0,
            sm11: 0,
            sm12: 0
          })
      }
    })

  }

  saveDoc(close: boolean): void {
    let responce: any

    this.izmDetailService.saveIzm(this.izmDetail)
      .subscribe(
        (data) => (
          this.izmDetailmsg.add({ severity: 'success', summary: 'Успешно', detail: 'Документ успешно записан!' }),
          responce = data, this.izmDetail = responce,
          this.closeform(close)
        ),
        (error) => (
          this.izmDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
        )
      )
  }

  onDelete(classification_id: number, classification_name: string) {
    this.izmDetailconfirm.confirm({
      message: 'Вы действительно хотите удалить ' + classification_name + '?',
      header: 'Удаление классификации',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        for (let i = 0; i < this.izmDetail.tbl1.length; ++i) {
          if (this.izmDetail.tbl1[i]._classification === classification_id) {
            this.izmDetail.tbl1.splice(i, 1);
          }
        }
      },
      reject: () => {
        this.izmDetailconfirm.close();
      }
    });
  }

  changedate() {
    this.izmDetail.doc._date = this.toLocaleDate(this.izmDetail.doc._date)
  }

  toLocaleDate(dateForStr: string) {
    return new Date(dateForStr).toLocaleDateString();
  }

  closeform(close: boolean) {
    if (close) {
      this.closeEvent.emit()
    }
  }
}
