import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SHA256 } from 'crypto-js';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { organization_detail } from 'src/app/directory/organization/interfaces';
import { OrganizationDetailComponent } from 'src/app/directory/organization/organization-detail/organization-detail.component';
import { OrganizationSelectComponent } from 'src/app/directory/organization/organization-select/organization-select.component';
import { profileuser } from 'src/app/login/interfaces';
import { MainComponent } from 'src/app/main/main.component/main.component';
import { report_29_30_Component } from 'src/app/reports/report_29_30/report_29_30';
import { report_33_35_Component } from 'src/app/reports/report_33_35/report_33_35';
import { report_37_39_Component } from 'src/app/reports/report_37_39/report_37_39';
import { doc_izm_detail, svod_expenses_detail, svod_expenses_doc, svod_select_doc } from '../interfaces';
import { svodExpensesService } from '../svod_expenses.service';
import { SvodSelectComponent } from '../svod_spravok_select/svod-spravok-select.component';

@Component({
  selector: 'app-svod-spravok-detail',
  templateUrl: './svod-spravok-detail.component.html',
  styleUrls: ['./svod-spravok-detail.component.css']
})
export class SvodSpravokDetailComponent implements OnInit {

  constructor(
    private MainComponent: MainComponent,
    private svodDetailService: svodExpensesService,
    private svodDetailmsg: MessageService,
    private svodDetailref: DynamicDialogRef,
    private svodDetaildialog: DialogService,
    private svodDetailconfirm: ConfirmationService
  ) {
    this.profileuser = this.MainComponent.profileuser
    this.items = [

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
        label: 'Приложение 37/39',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.showReport3739();
        }
      }
    ]
  }

  @Input() svod_exp_id: any
  @Output() newItemEvent = new EventEmitter<any>()
  @Output() closeEvent = new EventEmitter<any>()

  items: MenuItem[]
  profileuser: profileuser
  form: FormGroup
  svodDetail: svod_expenses_detail
  spravkatypes: any = []
  loading = false
  fkr_array_payments = [
    {
      _id: 0,
      _code: '',
      _name: ''
    }
  ]

  fkr_array_obligats = [
    {
      _id: 0,
      _code: '',
      _name: ''
    }
  ]

  fkr_payments = {
    _id: 0,
    _code: '',
    _name: ''
  }

  fkr_obligats = {
    _id: 0,
    _code: '',
    _name: ''
  }

  hashBegin = ''
  hashEnd = ''
  nochanged = true
  firstclick_pay = true
  allrecord_pay = true
  _lastfkr_pay = 0
  firstclick_obl = true
  allrecord_obl = true
  _lastfkr_obl = 0
  obligats: any = []
  payments: any = []
  totalPay = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  totalObl = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


  ngOnInit(): void {

    this.form = new FormGroup({
      number_doc: new FormControl(null),
      date_doc: new FormControl(null, [Validators.required]),
      org_name: new FormControl(null, [Validators.required]),
      type_name: new FormControl(null, [Validators.required])
    })

    if (this.svod_exp_id == '') {
      this.svod_exp_id = 0
    }
    this.svodDetailService
      .fetch_detail(parseInt(this.svod_exp_id))
      .subscribe(
        (detail) => {
          this.loading = true
          this.svodDetail = detail
          this.main()
        },
        (error) => {
          this.svodDetailmsg.add({
            severity: 'error', summary: 'Ошибка', detail: error.error.status
          })
        }
      )

    let objString = JSON.stringify(this.svodDetail)
    this.hashBegin = SHA256(objString).toString()

  }

  main() {
    this.obligats = this.svodDetail.obligats,
      this.payments = this.svodDetail.payments,
      this.addFKRtoPayments()
    this.addFKRtoObligats()
    this.calculateTotalPayments()
    this.calculateTotalObligats()
  }

  calculateTotalPayments() {
    this.totalPay = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (let i = 0; i < this.payments.length; i++) {
      for (let l = 1; l <= 12; l++) {
        this.totalPay[l] += this.payments[i]['sm' + l]
        this.totalPay[0] += this.payments[i]['sm' + l]
      }
    }
  }

  calculateTotalObligats() {

    this.totalObl = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (let i = 0; i < this.obligats.length; i++) {
      for (let l = 1; l <= 12; l++) {
        this.totalObl[l] += this.obligats[i]['sm' + l]
        this.totalObl[0] += this.obligats[i]['sm' + l]
      }
    }

  }

  setClassSelect_pay(_id: number) {

    if (!this.allrecord_pay && this._lastfkr_pay == _id) {
      return 'yellow-class'
    }
    else {
      return ''
    }
  }

  setClassSelect_obl(_id: number) {

    if (!this.allrecord_obl && this._lastfkr_obl == _id) {
      return 'yellow-class'
    }
    else {
      return ''
    }
  }

  addFKRtoPayments() {
    this.fkr_array_payments = []

    for (let i = 0; i < this.svodDetail.payments.length; i++) {

      let index = this.fkr_array_payments.findIndex(item => this.svodDetail.payments[i]._fkr_id === item._id)

      if (index !== -1) {
        continue
      }

      this.fkr_array_payments.push({
        _id: this.svodDetail.payments[i]._fkr_id,
        _code: this.svodDetail.payments[i]._fkr_code,
        _name: this.svodDetail.payments[i]._fkr_name
      })
    }

  }

  addFKRtoObligats() {
    this.fkr_array_obligats = []

    for (let i = 0; i < this.svodDetail.obligats.length; i++) {

      let index = this.fkr_array_obligats.findIndex(item => this.svodDetail.obligats[i]._fkr_id === item._id)

      if (index !== -1) {
        continue
      }

      this.fkr_array_obligats.push({
        _id: this.svodDetail.obligats[i]._fkr_id,
        _code: this.svodDetail.obligats[i]._fkr_code,
        _name: this.svodDetail.obligats[i]._fkr_name
      })
    }

  }

  showReport2930() {
    this.svodDetailref = this.svodDetaildialog.open(report_29_30_Component, {
      header: 'Отчеты',
      width: '95%',
      height: '95%',
      data: {
        'doc': {
          'id': this.svodDetail.doc.id,
          'nom': this.svodDetail.doc.nom,
          'name': 'Свод справок ' + this.svodDetail.doc.nom,
          'type_doc': 'svod'
        },
      },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }

  showReport3335() {
    this.svodDetailref = this.svodDetaildialog.open(report_33_35_Component, {
      header: 'Отчеты',
      width: '95%',
      height: '95%',
      data: {
        'doc': {
          'id': this.svodDetail.doc.id,
          'nom': this.svodDetail.doc.nom,
          'name': 'Свод справок ' + this.svodDetail.doc.nom,
          'type_doc': 'svod'
        },
      },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }

  showReport3739() {
    this.svodDetailref = this.svodDetaildialog.open(report_37_39_Component, {
      header: 'Отчеты',
      width: '95%',
      height: '95%',
      data: {
        'doc': {
          'id': this.svodDetail.doc.id,
          'nom': this.svodDetail.doc.nom,
          'name': 'Свод справок ' + this.svodDetail.doc.nom,
          'type_doc': 'svod'
        },
      },
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }

  ngDoCheck() {

    let objString = JSON.stringify(this.svodDetail)
    let hashBeg = SHA256(objString).toString()

    if (hashBeg !== this.hashBegin && this.nochanged) {
      this.nochanged = false
      this.hashBegin = hashBeg
    }
  }

  filterFKR_payments(_fkr: any) {

    if (this.firstclick_pay) {
      this._lastfkr_pay = _fkr._id
      this.firstclick_pay = false
    }

    if (this._lastfkr_pay == _fkr._id) {
      this.allrecord_pay = !this.allrecord_pay
    }
    else {
      this.allrecord_pay = false
    }

    if (!this.allrecord_pay) {

      this.payments = this.svodDetail.payments.filter(item => item['_fkr_id'] == _fkr._id)
      this.fkr_payments._id = _fkr._id
      this.fkr_payments._code = _fkr._code
      this.fkr_payments._name = _fkr._name

    }
    else {
      this.payments = this.svodDetail.payments
      this.fkr_payments._id = 0
      this.fkr_payments._code = ''
      this.fkr_payments._name = ''
    }

    this._lastfkr_pay = _fkr._id
    this.calculateTotalPayments()
  }

  filterFKR_obligats(_fkr: any) {

    if (this.firstclick_obl) {
      this._lastfkr_obl = _fkr._id
      this.firstclick_obl = false
    }

    if (this._lastfkr_obl == _fkr._id) {
      this.allrecord_obl = !this.allrecord_obl
    }
    else {
      this.allrecord_obl = false
    }

    if (!this.allrecord_obl) {
      this.obligats = this.svodDetail.obligats.filter(item => item['_fkr_id'] == _fkr._id)
      this.fkr_obligats._id = _fkr._id
      this.fkr_obligats._code = _fkr._code
      this.fkr_obligats._name = _fkr._name
    }
    else {
      this.obligats = this.svodDetail.obligats
      this.fkr_obligats._id = 0
      this.fkr_obligats._code = ''
      this.fkr_obligats._name = ''
    }

    this._lastfkr_obl = _fkr._id
    this.calculateTotalObligats()
  }

  onRowEdit(doc: doc_izm_detail) {
    this.newItemEvent.emit({ params: { selector: 'app-izm-plateji-detail', nomer: 'Изменения плана по расходам ' + doc.nom, id: doc.izm_id } })
  }

  addDoc() {

    if (this.svodDetail.doc.id == 0) {
      this.svodDetailmsg.add({
        severity: 'error', summary: 'Ошибка', detail: 'Сначала запишите документ, пожалуйста!'
      })
      return
    }

    this.svodDetailref = this.svodDetaildialog.open(SvodSelectComponent,
      {
        header: 'Добавление документа',
        width: '80%',
        height: '80%',
        data: {
          id_org: this.svodDetail.doc._organization.id,
          _type_izm_doc_id: this.svodDetail.doc._type_izm_doc.id,
          _date: this.svodDetail.doc._date
        }
      })

    this.svodDetailref.onClose.subscribe((docs_izm: svod_select_doc) => {
      if (docs_izm) {

        let docs = {
          doc_id: docs_izm.id,
          tipdoc: docs_izm.tipdoc
        }
        this.loading = false
        this.svodDetailService
          .add_docs(this.svodDetail.doc.id, docs)
          .subscribe(
            (detail) => {
              this.loading = true
              this.svodDetail = detail
              this.main()
            },
            (error) => {
              this.svodDetailmsg.add({
                severity: 'error', summary: 'Ошибка', detail: error.error.status
              })
            }
          )
      }
    })
  }

  getValue(svod: svod_expenses_doc): string {
    if (svod.tipdoc == 'izm') {
      return 'Изменение по расходам ' + svod.nom
    }
    else {
      return 'Свод по расходам ' + svod.nom
    }
  }

  onDelete(id_doc: number, nomer: string) {

    let docs = {
      doc_id: id_doc
    }

    this.svodDetailconfirm.confirm({
      message: 'Удалить документ ' + nomer + '?',
      header: 'Удаление документа',
      icon: 'pi pi-exclamation-triangle',
      accept: () => (
        this.loading = false,
        this.svodDetailService
          .delete_docs(this.svodDetail.doc.id, docs)
          .subscribe(
            (detail) => {
              this.loading = true
              this.svodDetail = detail
              this.main()
              this.svodDetailmsg.add({ severity: 'success', summary: 'Успешно', detail: 'Документ успешно удален!' })
              this.svodDetailconfirm.close()
            },
            (error) => {
              this.svodDetailmsg.add({
                severity: 'error', summary: 'Ошибка', detail: error.error.status
              })
              this.svodDetailconfirm.close()
            }
          )),
      reject: () => {
        this.svodDetailconfirm.close()
      }
    })
  }

  saveDoc(close: boolean) {
    let responce: any
    this.loading = false
    this.svodDetailService
      .saveSvod(this.svodDetail.doc)
      .subscribe(
        (data) => (
          this.loading = true,
          responce = data,
          this.svodDetail.doc.id = responce.doc_id,
          this.svodDetail.doc.nom = responce.nom,
          this.svodDetailmsg.add({ severity: 'success', summary: 'Успешно', detail: 'Документ успешно записан!' }),
          this.closeaftersave(close)
        ),
        (error) => {
          this.svodDetailmsg.add({
            severity: 'error', summary: 'Ошибка', detail: error.error.status
          })
        }
      )

  }

  viewOrg() {
    this.svodDetailref = this.svodDetaildialog.open(OrganizationDetailComponent,
      {
        header: 'Редактирование организации',
        width: '60%',
        height: '80%',
        data: { org_id: this.svodDetail.doc._organization.id }
      })

    this.svodDetailref.onClose.subscribe((org: organization_detail) => {
      if (org) {
        this.svodDetail.doc._organization.id = org.id,
          this.svodDetail.doc._organization.name_rus = org.name_rus
      }
    })
  }

  selectOrg() {
    this.svodDetailref = this.svodDetaildialog.open(OrganizationSelectComponent,
      {
        header: 'Выбор организации',
        width: '60%',
        height: '80%'
      })

    this.svodDetailref.onClose.subscribe((org: organization_detail) => {
      if (org) {
        this.svodDetail.doc._organization.id = org.id,
          this.svodDetail.doc._organization.name_rus = org.name_rus
      }
    })
  }

  changedate() {
    this.svodDetail.doc._date = this.toLocaleDate(this.svodDetail.doc._date)
  }

  toLocaleDate(dateForStr: string) {
    return new Date(dateForStr).toLocaleDateString() + ' ' + new Date(dateForStr).toLocaleTimeString();
  }

  setClass(deleted: boolean) {
    let classs = ''

    if (deleted) {
      classs = 'class-deleted'
    }

    return classs

  }

  closeaftersave(close: boolean) {
    let objString = JSON.stringify(this.svodDetail)
    this.hashEnd = SHA256(objString).toString()

    this.hashBegin = this.hashEnd

    if (close) {
      this.closeEvent.emit()
    }
  }

  closeform(close: boolean) {

    let objString = JSON.stringify(this.svodDetail)
    this.hashEnd = SHA256(objString).toString()

    if (close) {
      if (this.hashBegin == this.hashEnd) {
        this.closeEvent.emit()
      }
      else {
        this.svodDetailconfirm.confirm({
          message: 'Данные были изменены. Закрыть документ?',
          header: 'Закрытие',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.closeEvent.emit()
            this.svodDetailconfirm.close()
          },
          reject: () => {
            this.svodDetailconfirm.close()
          }
        })
      }
    }
  }

}
