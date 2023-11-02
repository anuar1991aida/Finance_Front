import { Component, DoCheck, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClassificationIncomeDetailComponent } from 'src/app/directory/income/classification-income/classification-income-detail/classification-income-detail.component';
import { classsification_income } from 'src/app/directory/income/classification-income/interfaces';
import { utv_income_detail } from '../interfaces';
import { UtvIncomeService } from '../utv_income.service';
import { SHA256 } from 'crypto-js';
import { OrganizationSelectComponent } from 'src/app/directory/organization/organization-select/organization-select.component';
import { OrganizationDetailComponent } from 'src/app/directory/organization/organization-detail/organization-detail.component';
import { organization_detail } from 'src/app/directory/organization/interfaces';
import { ClassificationIncomeSelectComponent } from 'src/app/directory/income/classification-income/classification-income-select/classification-income-select.component';
import { Budjet_detail } from 'src/app/directory/income/budjet/interfaces';

@Component({
  selector: 'app-utv-income-detail',
  templateUrl: './utv-income-detail.component.html',
  styleUrls: ['./utv-income-detail.component.css']
})
export class UtvIncomeDetailComponent implements OnInit, DoCheck {

  constructor(
    private utvDetailService: UtvIncomeService,
    private utvDetailmsg: MessageService,
    private utvDetailref: DynamicDialogRef,
    private utvDetaildialog: DialogService,
    private utvDetailconfirm: ConfirmationService,
  ) {

  }

  @Input() utv_inc_id = ''
  @Output() closeEvent = new EventEmitter<any>();

  items: MenuItem[];
  form: FormGroup

  budj_det: Budjet_detail = {
    adress: '',
    code: '',
    id: 0,
    name_kaz: '',
    name_rus: ''
  }

  utvDetail: utv_income_detail
  responce: any
  hashBegin = ''
  hashEnd = ''
  nochanged = true
  selected = false
  tbl: any = []
  total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  windowHeight = 0
  windowWidht = 0

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize()
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight
    this.windowWidht = window.innerWidth
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      number_doc: new FormControl(null, []),
      date_doc: new FormControl(null, [Validators.required]),
      org_name: new FormControl(null, [Validators.required])
    })

    if (this.utv_inc_id !== '') {
      this.utvDetailService.fetch_detail(this.utv_inc_id)
        .subscribe(
          (detail) => {
            this.utvDetail = detail,
              this.tbl = this.utvDetail.tbl1,
              this.calculate(0)
          },
          (error) => {
            this.utvDetailmsg.add({
              severity: 'error', summary: 'Ошибка', detail: error.error.status
            })
          }
        )
    }
    else {
      this.utvDetailService.fetch_detail('0')
        .subscribe(
          (detail) => {
            this.utvDetail = detail
            this.tbl = this.utvDetail.tbl1
          },
          (error) => {
            this.utvDetailmsg.add({
              severity: 'error', summary: 'Ошибка', detail: error.error.status
            })
          }
        )

      // this.utvDetail.tbl1.splice(0, this.utvDetail.tbl1.length)
    }

    let objString = JSON.stringify(this.utvDetail)
    this.hashBegin = SHA256(objString).toString()
    this.updateWindowSize()
  }

  ngDoCheck() {

    let objString = JSON.stringify(this.utvDetail)
    let hashBeg = SHA256(objString).toString()

    if (hashBeg !== this.hashBegin && this.nochanged) {
      this.nochanged = false
      this.hashBegin = hashBeg
    }
  }

  calculate(summ: number) {

    if (summ < 0) {
      summ = 0
      this.utvDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Нельзя указывать сумму меньше 0!' })
      return
    }

    this.total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (let i = 0; i < this.tbl.length; i++) {
      for (let l = 1; l <= 12; l++) {
        this.total[l] += this.tbl[i]['sm' + l]
        this.total[0] += this.tbl[i]['sm' + l]
      }
    }

  }

  addClassification() {
    this.utvDetailref = this.utvDetaildialog.open(ClassificationIncomeSelectComponent,
      {
        header: 'Выбор классификации',
        width: '60%',
        height: '80%'
      })

    this.utvDetailref.onClose.subscribe((classific: classsification_income) => {
      if (classific) {
        this.tbl.push(
          {
            _classification: {
              id: classific.id,
              code: classific.code,
              name_kaz: classific.name_kaz,
              name_rus: classific.name_rus
            },
            id: 0,
            god: 0,
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
            deleted: false,
            _organization: 0,
            _utv_inc: 0,
            _date: this.utvDetail.doc._date
          })
      }
    })
  }

  editClassification(ri: number) {
    this.utvDetailref = this.utvDetaildialog.open(ClassificationIncomeSelectComponent,
      {
        header: 'Выбор классификации',
        width: '60%',
        height: '80%'
      })

    this.utvDetailref.onClose.subscribe((classific: classsification_income) => {
      if (classific) {
        this.tbl[ri]._classification = {
          id: classific.id,
          code: classific.code,
          name_kaz: classific.name_kaz,
          name_rus: classific.name_rus
        }
      }
    })
  }

  viewClassification(classif_inc_id: number) {
    this.utvDetailref = this.utvDetaildialog.open(ClassificationIncomeDetailComponent,
      {
        header: 'Редактирование классификации',
        width: '60%',
        height: '40%',
        data: { classif_id: classif_inc_id }
      })

  }

  saveDoc(close: boolean): void {
    let responce: any
    this.utvDetail.tbl1 = this.tbl

    this.utvDetailService
      .saveUtv(this.utvDetail)
      .subscribe(
        (data) => (
          responce = data,
          this.utvDetail.doc.id = responce.id_doc,
          this.utvDetail.doc.nom = responce.nom,
          this.utvDetailmsg.add({ severity: 'success', summary: 'Успешно', detail: responce.status }),
          this.closeaftersave(close)
        ),
        (error) => (
          this.utvDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
        )
      )
  }

  onDelete(_classification: classsification_income) {

    this.utvDetailconfirm.confirm({
      message: 'Вы действительно хотите удалить ' + _classification.name_rus + '?',
      header: 'Удаление классификации',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        for (let i = this.tbl.length - 1; i >= 0; i--) {
          let index = this.tbl.findIndex((item: any) => _classification.id === item._classification.id)
          if (index !== -1) {
            this.tbl.splice(index, 1)
          }
        }
        this.utvDetailconfirm.close()
        this.calculate(0)
      },
      reject: () => {
        this.utvDetailconfirm.close();
      }
    })
  }

  viewOrg() {
    this.utvDetailref = this.utvDetaildialog.open(OrganizationDetailComponent,
      {
        header: 'Редактирование организации',
        width: '60%',
        height: '80%',
        data: { org_id: this.utvDetail.doc._organization.id }
      })

    this.utvDetailref.onClose.subscribe((org: organization_detail) => {
      if (org) {
        this.utvDetail.doc._organization.id = org.id,
          this.utvDetail.doc._organization.name_rus = org.name_rus
      }
    })
  }

  selectOrg() {
    this.utvDetailref = this.utvDetaildialog.open(OrganizationSelectComponent,
      {
        header: 'Выбор организации',
        width: '60%',
        height: '80%'
      })

    this.utvDetailref.onClose.subscribe((org: organization_detail) => {
      if (org) {
        this.utvDetail.doc._organization.id = org.id,
          this.utvDetail.doc._organization.name_rus = org.name_rus
      }
    })
  }

  changedate() {
    this.utvDetail.doc._date = this.toLocaleDate(this.utvDetail.doc._date)
  }

  toLocaleDate(dateForStr: string) {
    return new Date(dateForStr).toLocaleDateString() + ' ' + new Date(dateForStr).toLocaleTimeString()
  }

  closeaftersave(close: boolean) {
    let objString = JSON.stringify(this.utvDetail)
    this.hashEnd = SHA256(objString).toString()

    this.hashBegin = this.hashEnd

    if (close) {
      this.closeEvent.emit()
    }
  }

  closeform(close: boolean) {

    let objString = JSON.stringify(this.utvDetail)
    this.hashEnd = SHA256(objString).toString()

    if (close) {
      if (this.hashBegin == this.hashEnd) {
        this.closeEvent.emit()
      }
      else {
        this.utvDetailconfirm.confirm({
          message: 'Данные были изменены. Закрыть документ?',
          header: 'Закрытие',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.closeEvent.emit()
            this.utvDetailconfirm.close()
          },
          reject: () => {
            this.utvDetailconfirm.close()
          }
        })
      }
    }
  }
}
