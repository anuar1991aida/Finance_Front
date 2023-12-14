import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SHA256 } from 'crypto-js';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FkrSelectComponent } from 'src/app/directory/expenses/fkr/fkr-select/fkr-select.component';
import { fkr_detail } from 'src/app/directory/expenses/fkr/interfaces';
import { SpecificationExpSelectComponent } from 'src/app/directory/expenses/specification-exp/specification-exp-select/specification-exp-select.component';
import { Budjet_detail } from 'src/app/directory/income/budjet/interfaces';
import { specification_income_detail } from 'src/app/directory/income/specification-income/interfaces';
import { organization_detail } from 'src/app/directory/organization/interfaces';
import { OrganizationDetailComponent } from 'src/app/directory/organization/organization-detail/organization-detail.component';
import { OrganizationSelectComponent } from 'src/app/directory/organization/organization-select/organization-select.component';
import { IzmIncomeService } from 'src/app/documents/income/izm_inc_doc/izm_income.service';
import { izm_plateji_detail } from '../interfaces';
import { IzmPlatezhiService } from '../izm-plateji.services';
import { DomSanitizer } from '@angular/platform-browser';
import { reportComponent } from '../../../../reports/report';
import { report_33_35_Component } from 'src/app/reports/report_33_35/report_33_35';
import { report_29_30_Component } from 'src/app/reports/report_29_30/report_29_30';
import { report_27_28_Component } from 'src/app/reports/report_27_28/report_27_28';
import { report_export_Component } from 'src/app/reports/report_export_K2/report_export';

@Component({
  selector: 'app-izm-plateji-detail',
  templateUrl: './izm-plateji-detail.component.html',
  styleUrls: ['./izm-plateji-detail.component.css']
})
export class IzmPlatejiDetailComponent implements OnInit {
  constructor(
    private izmDetailService: IzmIncomeService,
    private izmPlatezhiDetailService: IzmPlatezhiService,
    private izmPlatezhiDetailmsg: MessageService,
    private izmPlatezhiDetailref: DynamicDialogRef,
    private izmPlatezhiDetaildialog: DialogService,
    private izmPlatezhiDetailconfirm: ConfirmationService,
  ) {
    this.items = [
      {
        label: 'Приложение 27/28',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.showReport2728();
        }
      },
      {
        label: 'Приложение 29/30',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.showReport2930();
        }
      },
      {
        label: 'Приложение 33/35',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.showReport3335();
        }
      },
      {
        label: 'Экспорт в казначейство',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.showReportExport();
        }
      }
    ]
  }

  @Input() izm_inc_id = ''
  @Output() closeEvent = new EventEmitter<any>()
  @Output() closeed = false

  items: MenuItem[]
  form: FormGroup
  obligats: any = []
  payments: any = []
  spravkatypes: any = []
  izmPlatezhiDetail!: izm_plateji_detail
  responce: any
  nochanged = true
  hashBegin = ''
  hashEnd = ''
  firstclick = true
  _lastfkr = 0
  allrecord = true
  loading = false
  url = ''
  PDFURL: any
  numberMonth = 0

  spec_detail: specification_income_detail = {
    id: 0,
    code: '',
    name_kaz: '',
    name_rus: ''
  }

  fkr_detail: fkr_detail = {
    id: 0,
    code: '',
    name_kaz: '',
    name_rus: ''
  }

  budj_det: Budjet_detail = {
    adress: '',
    code: '',
    id: 0,
    name_kaz: '',
    name_rus: ''
  }

  fkr_array: fkr_detail[] = []
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
      number_doc: new FormControl(null),
      date_doc: new FormControl(null, [Validators.required]),
      org_name: new FormControl(null, [Validators.required]),
      type_name: new FormControl(null, [Validators.required])
    })

    if (this.izm_inc_id !== '') {
      this.izmPlatezhiDetailService.fetch_detail(this.izm_inc_id)
        .subscribe(
          (detail) => {
            this.izmPlatezhiDetail = detail,
              this.payments = this.izmPlatezhiDetail.payments,
              this.obligats = this.izmPlatezhiDetail.obligats,
              this.numberMonth = parseInt(this.izmPlatezhiDetail.doc._date.slice(3, 5)),
              this.addFKRtoArray()
            this.calculatePay()
            this.calculateObl()
          },
          (error) => {
            this.izmPlatezhiDetailmsg.add({
              severity: 'error', summary: 'Ошибка', detail: error.error.status
            })
          }
        )
    }
    else {
      this.izmPlatezhiDetailService
        .fetch_detail('0')
        .subscribe(
          (detail) => {
            this.izmPlatezhiDetail = detail
            this.izmPlatezhiDetail.payments.splice(0, this.izmPlatezhiDetail.payments.length)
            this.izmPlatezhiDetail.obligats.splice(0, this.izmPlatezhiDetail.obligats.length)
          },
          (error) => {
            this.izmPlatezhiDetailmsg.add({
              severity: 'error', summary: 'Ошибка', detail: error.error.status
            })
          })
    }

    let objString = JSON.stringify(this.izmPlatezhiDetail)
    this.hashBegin = SHA256(objString).toString()

    this.updateWindowSize()
  }


  calculateObl() {
    for (let i = 0; i < this.obligats.length; i++) {
      for (let x of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
        this.obligats[i]['itog' + x] = this.obligats[i]['utv' + x] + this.obligats[i]['sm' + x]
      }
    }
  }

  calculatePay() {
    for (let i = 0; i < this.payments.length; i++) {
      for (let x of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
        this.payments[i]['itog' + x] = this.payments[i]['utv' + x] + this.payments[i]['sm' + x]
      }
    }
  }

  setClassSelect(_id: number) {

    if (!this.allrecord && this._lastfkr == _id) {
      return 'yellow-class'
    }
    else {
      return ''
    }
  }

  showReport2728() {
    this.izmPlatezhiDetailref = this.izmPlatezhiDetaildialog.open(report_27_28_Component, {
      header: 'Отчеты',
      width: '95%',
      height: '95%',
      data: {
        'doc': {
          'id': this.izmPlatezhiDetail.doc.id,
          'nom': this.izmPlatezhiDetail.doc.nom,
          'name': 'Изменения плана по расходам ' + this.izmPlatezhiDetail.doc.nom,
          'type_doc': 'izm'
        },
      },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }

  showReport2930() {
    this.izmPlatezhiDetailref = this.izmPlatezhiDetaildialog.open(report_29_30_Component, {
      header: 'Отчеты',
      width: '95%',
      height: '95%',
      data: {
        'doc': {
          'id': this.izmPlatezhiDetail.doc.id,
          'nom': this.izmPlatezhiDetail.doc.nom,
          'name': 'Изменения плана по расходам ' + this.izmPlatezhiDetail.doc.nom,
          'type_doc': 'izm'
        },
      },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }

  showReport3335() {
    this.izmPlatezhiDetailref = this.izmPlatezhiDetaildialog.open(report_33_35_Component, {
      header: 'Отчеты',
      width: '95%',
      height: '95%',
      data: {
        'doc': {
          'id': this.izmPlatezhiDetail.doc.id,
          'nom': this.izmPlatezhiDetail.doc.nom,
          'name': 'Изменения плана по расходам ' + this.izmPlatezhiDetail.doc.nom,
          'type_doc': 'izm'
        },
      },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }

  showReportExport() {
    this.izmPlatezhiDetailref = this.izmPlatezhiDetaildialog.open(report_export_Component, {
      header: 'Отчеты',
      width: '95%',
      height: '95%',
      data: {
        'doc': {
          'id': this.izmPlatezhiDetail.doc.id,
          'nom': this.izmPlatezhiDetail.doc.nom,
          'name': 'Изменения плана по расходам ' + this.izmPlatezhiDetail.doc.nom,
          'type_doc': 'izm'
        },
      },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }

  addFKRtoArray() {
    this.fkr_array = []

    for (let i = 0; i < this.izmPlatezhiDetail.payments.length; i++) {

      let index = this.fkr_array.findIndex(item => this.izmPlatezhiDetail.payments[i]._fkr_id === item.id)

      if (index !== -1) {
        continue
      }

      this.fkr_array.push({
        id: this.izmPlatezhiDetail.payments[i]._fkr_id,
        code: this.izmPlatezhiDetail.payments[i]._fkr_code,
        name_rus: this.izmPlatezhiDetail.payments[i]._fkr_name,
        name_kaz: this.izmPlatezhiDetail.payments[i]._fkr_name
      })
    }
  }

  ngDoCheck() {

    let objString = JSON.stringify(this.izmPlatezhiDetail)
    let hashBeg = SHA256(objString).toString()

    if (hashBeg !== this.hashBegin && this.nochanged) {
      this.nochanged = false
      this.hashBegin = hashBeg
    }
  }

  gettypespr() {
    if (this.spravkatypes.length == 0) {
      this.izmDetailService.gettypespr()
        .subscribe(
          (data) => (
            this.spravkatypes = data
          )
        )
    }
  }


  onDelete(izm: any) {
    this.izmPlatezhiDetailconfirm.confirm({
      message: 'Вы действительно хотите удалить ' + izm._spec_name + '?',
      header: 'Удаление классификации',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delSpec(izm)
        this.izmPlatezhiDetailconfirm.close()
      },
      reject: () => {
        this.izmPlatezhiDetailconfirm.close()
      }
    })
  }

  delSpec(izm: any) {
    for (let i = this.izmPlatezhiDetail.payments.length - 1; i >= 0; i--) {

      let index = this.izmPlatezhiDetail.payments.findIndex(item => izm._fkr_id === item._fkr_id && izm._spec_id === item._spec_id)
      if (index !== -1) {
        this.izmPlatezhiDetail.payments.splice(index, 1)
      }
    }

    this.payments = this.izmPlatezhiDetail.payments.filter(item => item['_fkr_id'] == izm._fkr_id)


    for (let i = this.izmPlatezhiDetail.obligats.length - 1; i >= 0; i--) {
      let index = this.izmPlatezhiDetail.obligats.findIndex(item => izm._fkr_id === item._fkr_id && izm._spec_id === item._spec_id)
      if (index !== -1) {
        this.izmPlatezhiDetail.obligats.splice(index, 1)
      }
    }
    this.obligats = this.izmPlatezhiDetail.obligats.filter(item => item['_fkr_id'] == izm._fkr_id)


    this.addFKRtoArray()
  }

  addFKR() {

    if (this.izmPlatezhiDetail.doc._date == '') {
      this.izmPlatezhiDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Заполните дату!' })
      return
    }

    if (this.izmPlatezhiDetail.doc._organization.id == 0) {
      this.izmPlatezhiDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите организацию!' })
      return
    }

    let exclude = []
    for (let i = 0; i < this.fkr_array.length; i++) {
      exclude.push(this.fkr_array[i].id)
    }

    this.izmPlatezhiDetailref = this.izmPlatezhiDetaildialog.open(FkrSelectComponent,
      {
        header: 'Выбор ФКР',
        width: '60%',
        height: '80%',
        data: {
          org_id: this.izmPlatezhiDetail.doc._organization.id,
          exclude: exclude
        }
      })

    this.izmPlatezhiDetailref.onClose.subscribe((fkr_detail: fkr_detail) => {
      if (fkr_detail) {
        this.fkr_array.push({
          id: fkr_detail.id,
          code: fkr_detail.code,
          name_kaz: fkr_detail.name_kaz,
          name_rus: fkr_detail.name_rus
        })
      }
    }
    )
  }

  addSpec(fkr_detail: fkr_detail, payments: boolean) {

    if (this.izmPlatezhiDetail.doc._date == '') {
      this.izmPlatezhiDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Заполните дату!' })
      return
    }

    if (this.izmPlatezhiDetail.doc._organization.id == 0) {
      this.izmPlatezhiDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите организацию!' })
      return
    }

    let exclude = []
    for (let i = 0; i < this.payments.length; i++) {
      exclude.push(this.payments[i]._spec_id)
    }

    if (fkr_detail !== undefined) {
      this.izmPlatezhiDetailref = this.izmPlatezhiDetaildialog.open(SpecificationExpSelectComponent,
        {
          header: 'Выбор спецификации',
          width: '60%',
          height: '80%',
          data: {
            exclude: exclude
          }
        })

      this.izmPlatezhiDetailref
        .onClose.subscribe((spec_detail: specification_income_detail) => {
          if (spec_detail) {
            let responce: any

            let mass = {
              '_organization': this.izmPlatezhiDetail.doc._organization.id,
              '_fkr': fkr_detail.id,
              '_spec': spec_detail.id,
              '_date': this.izmPlatezhiDetail.doc._date
            }


            this.izmPlatezhiDetailService
              .get_ostatok_expenses(mass)
              .subscribe(
                (detail) => {
                  responce = detail,
                    this.izmPlatezhiDetail.payments.push(responce.pay)
                  this.izmPlatezhiDetail.obligats.push(responce.obl)
                  this.obligats = this.izmPlatezhiDetail.obligats.filter(item => item['_fkr_id'] == fkr_detail.id)
                  this.payments = this.izmPlatezhiDetail.payments.filter(item => item['_fkr_id'] == fkr_detail.id)
                })
          }
        }
        )
    }
    else {
      this.izmPlatezhiDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите ФКР!' })
      return
    }
  }

  pushArray(fkr_detail: fkr_detail, spec_detail: specification_income_detail, tab: any) {
    tab.push(
      {
        id: 0,
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
        utv1: 0,
        utv2: 0,
        utv3: 0,
        utv4: 0,
        utv5: 0,
        utv6: 0,
        utv7: 0,
        utv8: 0,
        utv9: 0,
        utv10: 0,
        utv11: 0,
        utv12: 0,
        itog1: 0,
        itog2: 0,
        itog3: 0,
        itog4: 0,
        itog5: 0,
        itog6: 0,
        itog7: 0,
        itog8: 0,
        itog9: 0,
        itog10: 0,
        itog11: 0,
        itog12: 0,
        _fkr_id: fkr_detail.id,
        _fkr_name: fkr_detail.name_rus,
        _fkr_code: fkr_detail.code,
        _spec_id: spec_detail.id,
        _spec_code: spec_detail.code,
        _spec_name: spec_detail.name_rus
      })
  }

  filterFKR(_fkr: fkr_detail) {

    if (this.firstclick) {
      this._lastfkr = _fkr.id
      this.firstclick = false
    }

    if (this._lastfkr == _fkr.id) {
      this.allrecord = !this.allrecord
    }
    else {
      this.allrecord = false
    }

    if (!this.allrecord) {
      this.obligats = this.izmPlatezhiDetail.obligats.filter(item => item['_fkr_id'] == _fkr.id)
      this.payments = this.izmPlatezhiDetail.payments.filter(item => item['_fkr_id'] == _fkr.id)

      this.fkr_detail.id = _fkr.id
      this.fkr_detail.code = _fkr.code
      this.fkr_detail.name_kaz = _fkr.name_kaz
      this.fkr_detail.name_rus = _fkr.name_rus

    }
    else {
      this.obligats = this.izmPlatezhiDetail.obligats
      this.payments = this.izmPlatezhiDetail.payments

      this.fkr_detail.id = 0
      this.fkr_detail.code = ''
      this.fkr_detail.name_kaz = ''
      this.fkr_detail.name_rus = ''
    }

    this._lastfkr = _fkr.id

  }

  selectFKR(_fkr: fkr_detail): string {

    if (!this.allrecord) {
      return 'yellow-class'
    }
    else {
      return ''
    }
  }

  saveDoc(close: boolean) {

    if (this.izmPlatezhiDetail.doc._type_izm_doc.id == 0) {
      this.izmPlatezhiDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Не выбран тип справки!' })
      return
    }

    let responce: any
    this.izmPlatezhiDetailService.saveUtv(this.izmPlatezhiDetail)
      .subscribe(
        (data) => (
          responce = data,
          this.izmPlatezhiDetail.doc.id = responce.id_doc,
          this.izmPlatezhiDetail.doc.nom = responce.nom,
          this.izmPlatezhiDetailmsg.add({ severity: 'success', summary: 'Успешно', detail: responce.status }),
          this.closeaftersave(close)
        ),
        (error) => (
          this.izmPlatezhiDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
        )
      )
  }

  closeaftersave(close: boolean) {


    let objString = JSON.stringify(this.izmPlatezhiDetail)
    this.hashEnd = SHA256(objString).toString()

    this.hashBegin = this.hashEnd



    if (close) {
      this.closeEvent.emit()
    }
  }

  selectOrg() {
    this.izmPlatezhiDetailref = this.izmPlatezhiDetaildialog.open(OrganizationSelectComponent,
      {
        header: 'Выбор организации',
        width: '60%',
        height: '80%'
      })

    this.izmPlatezhiDetailref.onClose.subscribe((org: organization_detail) => {
      if (org) {
        this.izmPlatezhiDetail.doc._organization.id = org.id,
          this.izmPlatezhiDetail.doc._organization.name_rus = org.name_rus
      }
    })
  }

  viewOrg() {
    this.izmPlatezhiDetailref = this.izmPlatezhiDetaildialog.open(OrganizationDetailComponent,
      {
        header: 'Редактирование организации',
        width: '60%',
        height: '80%',
        data: { org_id: this.izmPlatezhiDetail.doc._organization }
      })

    this.izmPlatezhiDetailref.onClose.subscribe((org: organization_detail) => {
      if (org) {
        this.izmPlatezhiDetail.doc._organization.id = org.id,
          this.izmPlatezhiDetail.doc._organization.name_rus = org.name_rus
      }
    })
  }

  changedate() {
    this.izmPlatezhiDetail.doc._date = this.toLocaleDate(this.izmPlatezhiDetail.doc._date)
    this.numberMonth = parseInt(this.izmPlatezhiDetail.doc._date.slice(3, 5))
  }

  toLocaleDate(dateForStr: string) {
    return new Date(dateForStr).toLocaleDateString() + ' ' + new Date(dateForStr).toLocaleTimeString();
  }

  closeform(close: boolean) {

    let objString = JSON.stringify(this.izmPlatezhiDetail)
    this.hashEnd = SHA256(objString).toString()

    if (close) {
      if (this.hashBegin == this.hashEnd) {
        this.closeEvent.emit()
      }
      else {
        this.izmPlatezhiDetailconfirm.confirm({
          message: 'Данные были изменены. Закрыть документ?',
          header: 'Закрытие',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.closeEvent.emit()
            this.izmPlatezhiDetailconfirm.close()
          },
          reject: () => {
            this.izmPlatezhiDetailconfirm.close()
          }
        })
      }
    }
  }

}
