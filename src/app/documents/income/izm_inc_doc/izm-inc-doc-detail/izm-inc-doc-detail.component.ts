import { Component, DoCheck, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClassificationIncomeDetailComponent } from 'src/app/directory/income/classification-income/classification-income-detail/classification-income-detail.component';
import { ClassificationIncomeSelectComponent } from 'src/app/directory/income/classification-income/classification-income-select/classification-income-select.component';
import { organization_detail } from 'src/app/directory/organization/interfaces';
import { OrganizationDetailComponent } from 'src/app/directory/organization/organization-detail/organization-detail.component';
import { OrganizationSelectComponent } from 'src/app/directory/organization/organization-select/organization-select.component';
import { izm_inc_doc_detail } from '../interfaces';
import { IzmIncomeService } from '../izm_income.service';
import { SHA256 } from 'crypto-js';
import { Budjet_detail } from 'src/app/directory/income/budjet/interfaces';
import { classsification_income } from 'src/app/directory/income/classification-income/interfaces';
import { reportComponent } from 'src/app/reports/report';

@Component({
  selector: 'app-izm-inc-doc-detail',
  templateUrl: './izm-inc-doc-detail.component.html',
  styleUrls: ['./izm-inc-doc-detail.component.css']
})
export class IzmIncDocDetailComponent implements OnInit, DoCheck {

  constructor(
    private izmDetailService: IzmIncomeService,
    private izmDetailmsg: MessageService,
    private izmDetailref: DynamicDialogRef,
    private izmDetaildialog: DialogService,
    private izmDetailconfirm: ConfirmationService,
  ) {
    this.items = [
      {
        label: 'Приложение 25',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.showReport25();
        }
      }
    ]
  }

  @Input() izm_inc_id = ''
  @Output() closeEvent = new EventEmitter<any>()
  @Output() closeed = false

  items: MenuItem[];
  form: FormGroup
  izmDetail: izm_inc_doc_detail
  responce: any
  nochanged = true
  hashBegin = ''
  hashEnd = ''
  selected = false
  numberMonth = 0
  spravkatypes: any = []

  windowHeight = 0
  windowWidth = 0

  totalUtv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  totalSm = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  totalItog = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  TotalUtvGod = 0
  TotalSmGod = 0
  TotalItogGod = 0

  tbl: any = []
  budj_det: Budjet_detail = {
    adress: '',
    code: '',
    id: 0,
    name_kaz: '',
    name_rus: ''
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize()
  }

  closeform(close: boolean) {

    let objString = JSON.stringify(this.izmDetail)
    this.hashEnd = SHA256(objString).toString()

    if (close) {
      if (this.hashBegin == this.hashEnd) {
        this.closeEvent.emit()
      }
      else {
        this.izmDetailconfirm.confirm({
          message: 'Данные были изменены. Закрыть документ?',
          header: 'Закрытие',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.closeEvent.emit()
            this.izmDetailconfirm.close()
          },
          reject: () => {
            this.izmDetailconfirm.close()
          }
        })
      }
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      number_doc: new FormControl(null),
      date_doc: new FormControl(null, [Validators.required]),
      org_name: new FormControl(null, [Validators.required]),
      type_name: new FormControl(null, [Validators.required])
    })
    if (this.izm_inc_id !== '') {
      this.izmDetailService
        .fetch_detail(this.izm_inc_id)
        .subscribe(
          (detail) => {
            this.izmDetail = detail,
              this.tbl = this.izmDetail.tbl1
            this.numberMonth = parseInt(this.izmDetail.doc._date.slice(3, 5)),
              this.calculatetot()
          },
          (error) => {
            this.izmDetailmsg.add({
              severity: 'error', summary: 'Ошибка', detail: error.error.status
            })
          }
        )
    }
    else {
      this.izmDetailService
        .fetch_detail('0')
        .subscribe(
          (detail) => {
            this.izmDetail = detail,
              this.tbl = this.izmDetail.tbl1
          },
          (error) => {
            this.izmDetailmsg.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: error.error.status
            })
          }
        )
      // this.izmDetail.tbl1.splice(0, this.izmDetail.tbl1.length)
    }

    this.updateWindowSize()
    let objString = JSON.stringify(this.izmDetail)
    this.hashBegin = SHA256(objString).toString()

  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight
    this.windowWidth = window.innerWidth
  }

  showReport25() {
    this.izmDetailref = this.izmDetaildialog.open(reportComponent, {
      header: 'Отчеты',
      width: '95%',
      height: '95%',
      data: {
        'doc': {
          'id': this.izmDetail.doc.id,
          'nom': this.izmDetail.doc.nom,
          'type_doc': 'izm-inc',
          'service': 'report25',
          'prilozhenieValue': 'pay',
          'prilozhenieType': [
            { label: 'Приложение 25', value: 'pay' }
          ]
        },
      },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }

  calculatetot() {
    this.totalUtv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.totalSm = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.totalItog = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    this.TotalUtvGod = 0
    this.TotalSmGod = 0
    this.TotalItogGod = 0

    for (let i = 0; i < this.tbl.length; i++) {
      for (let x of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
        this.tbl[i]['itog' + x] = this.tbl[i]['utv' + x] + this.tbl[i]['sm' + x]

        this.totalSm[x] += this.tbl[i]['sm' + x]
        this.totalUtv[x] += this.tbl[i]['utv' + x]
        this.totalItog[x] += this.tbl[i]['itog' + x]

        this.TotalUtvGod += this.totalUtv[x]
        this.TotalSmGod += this.totalSm[x]
        this.TotalItogGod += this.totalSm[x]
      }
    }
  }

  ngDoCheck() {

    let objString = JSON.stringify(this.izmDetail)
    let hashBeg = SHA256(objString).toString()

    if (hashBeg !== this.hashBegin && this.nochanged) {
      this.nochanged = false
      this.hashBegin = hashBeg
    }
  }

  editClassification(ri: number) {

    this.izmDetailref = this.izmDetaildialog.open(ClassificationIncomeSelectComponent,
      {
        header: 'Выбор классификации',
        width: '60%',
        height: '80%'
      })

    this.izmDetailref.onClose.subscribe((classific: any) => {
      if (classific) {
        this.tbl.splice(ri, 1)
        this.addClassificationRow(classific)
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
    this.izmDetailref = this.izmDetaildialog.open(ClassificationIncomeSelectComponent,
      {
        header: 'Выбор классификации',
        width: '60%',
        height: '80%'
      })

    this.izmDetailref.onClose.subscribe((classific: classsification_income) => {
      if (classific) {
        this.addClassificationRow(classific)
      }
    })

  }

  addClassificationRow(classific: classsification_income) {
    let params = {
      _organization: this.izmDetail.doc._organization.id,
      date: this.izmDetail.doc._date,
      _classification: classific.id
    }

    this.izmDetailService.getOstatok(params)
      .subscribe(
        (data) => (
          this.izmDetail.tbl1.push(data),
          this.calculatetot()
        )

      )
  }

  saveDoc(close: boolean): void {

    if (this.izmDetail.doc._type_izm_doc.id == 0) {
      this.izmDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Не выбран тип справки!' })
      return
    }

    let responce: any
    this.izmDetail.tbl1 = this.tbl

    this.izmDetailService.saveIzm(this.izmDetail)
      .subscribe(
        (data) => (
          responce = data,
          this.izmDetail.doc.id = responce.id_doc,
          this.izmDetail.doc.nom = responce.nom,
          this.izmDetailmsg.add({ severity: 'success', summary: 'Успешно', detail: responce.status }),
          this.closeaftersave(close)
        ),
        (error) => (
          this.izmDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
        )
      )
  }

  closeaftersave(close: boolean) {
    let objString = JSON.stringify(this.izmDetail)
    this.hashEnd = SHA256(objString).toString()

    this.hashBegin = this.hashEnd

    if (close) {
      this.closeEvent.emit()
    }
  }

  selectOrg() {
    this.izmDetailref = this.izmDetaildialog.open(OrganizationSelectComponent,
      {
        header: 'Выбор организации',
        width: '60%',
        height: '80%'
      })

    this.izmDetailref.onClose.subscribe((org: organization_detail) => {
      if (org) {
        this.izmDetail.doc._organization = org
      }
    })
  }

  viewOrg() {
    this.izmDetailref = this.izmDetaildialog.open(OrganizationDetailComponent,
      {
        header: 'Редактирование организации',
        width: '60%',
        height: '80%',
        data: { org_id: this.izmDetail.doc._organization.id }
      })

    this.izmDetailref.onClose.subscribe((org: organization_detail) => {
      if (org) {
        this.izmDetail.doc._organization = org
      }
    })
  }

  onDelete(ri: number, classification_name: string) {

    this.izmDetailconfirm.confirm({
      message: 'Вы действительно хотите удалить ' + classification_name + '?',
      header: 'Удаление классификации',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.izmDetail.tbl1.splice(ri, 1)
        this.izmDetailconfirm.close()
        this.calculatetot()
      },
      reject: () => {
        this.izmDetailconfirm.close()
      }
    })
  }

  changedate() {
    this.izmDetail.doc._date = this.toLocaleDate(this.izmDetail.doc._date)
    this.numberMonth = parseInt(this.izmDetail.doc._date.slice(3, 5))
  }

  toLocaleDate(dateForStr: string) {
    return new Date(dateForStr).toLocaleDateString() + ' ' + new Date(dateForStr).toLocaleTimeString();
  }


}
