import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SHA256 } from 'crypto-js';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { fkr_detail } from 'src/app/directory/expenses/fkr/interfaces';
import { organization_detail } from 'src/app/directory/organization/interfaces';
import { OrganizationDetailComponent } from 'src/app/directory/organization/organization-detail/organization-detail.component';
import { OrganizationSelectComponent } from 'src/app/directory/organization/organization-select/organization-select.component';
import { profileuser } from 'src/app/login/interfaces';
import { MainComponent } from 'src/app/main/main.component/main.component';
import { IzmPlatejiListComponent } from '../../izm-plateji-doc/izm-plateji-list/izm-plateji-list.component';
import { doc_izm_detail, svod_expenses_detail } from '../interfaces';
import { svodExpensesService } from '../svod_expenses.service';

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
  }

  @Input() svod_exp_id: any
  @Output() newItemEvent = new EventEmitter<any>()
  @Output() closeEvent = new EventEmitter<any>()

  profileuser: profileuser
  form: FormGroup
  svodDetail: svod_expenses_detail

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
  firstclick = true
  allrecord = true
  _lastfkr = 0
  obligats: any = []
  payments: any = []


  ngOnInit(): void {

    this.form = new FormGroup({
      number_doc: new FormControl(null),
      date_doc: new FormControl(null, [Validators.required]),
      org_name: new FormControl(null, [Validators.required])
    })

    if (this.svod_exp_id == '') {
      this.svod_exp_id = 0
    }
    this.svodDetailService
      .fetch_detail(parseInt(this.svod_exp_id))
      .subscribe(
        (detail) => {
          this.svodDetail = detail,
            this.obligats = this.svodDetail.obligats,
            this.payments = this.svodDetail.payments,
            this.addFKRtoPayments()
          this.addFKRtoObligats()
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

  ngDoCheck() {

    let objString = JSON.stringify(this.svodDetail)
    let hashBeg = SHA256(objString).toString()

    if (hashBeg !== this.hashBegin && this.nochanged) {
      this.nochanged = false
      this.hashBegin = hashBeg
    }
  }

  filterFKR_payments(_fkr: any, payments: boolean) {

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

      if (payments) {
        this.payments = this.svodDetail.payments.filter(item => item['_fkr_id'] == _fkr._id)

        this.fkr_payments._id = _fkr._id
        this.fkr_payments._code = _fkr._code
        this.fkr_payments._name = _fkr._name
      }
      else {
        this.obligats = this.svodDetail.obligats.filter(item => item['_fkr_id'] == _fkr._id)

        this.fkr_obligats._id = _fkr._id
        this.fkr_obligats._code = _fkr._code
        this.fkr_obligats._name = _fkr._name
      }

    }
    else {
      if (payments) {
        this.payments = this.svodDetail.payments

        this.fkr_payments._id = 0
        this.fkr_payments._code = ''
        this.fkr_payments._name = ''
      }
      else {
        this.obligats = this.svodDetail.obligats

        this.fkr_obligats._id = 0
        this.fkr_obligats._code = ''
        this.fkr_obligats._name = ''
      }
    }

    this._lastfkr = _fkr.id

  }

  onRowEdit(doc: doc_izm_detail) {
    this.newItemEvent.emit({ params: { selector: 'app-izm-plateji-detail', nomer: 'Изменения плана по расходам ' + doc.nom, id: doc.izm_id } })
  }

  addDoc() {
    this.svodDetailref = this.svodDetaildialog.open(IzmPlatejiListComponent,
      {
        header: 'Добавление документа',
        width: '80%',
        height: '80%'
      })

    this.svodDetailref.onClose.subscribe((docs_izm: any) => {
      if (docs_izm) {

        let doc = {
          id: 0,
          izm_id: docs_izm.id,
          nom: docs_izm.nom,
          _date: docs_izm._date,
          _organization_id: docs_izm._organization.id,
          _organization_name: docs_izm._organization.name_rus
        }

        let docs = {
          doc_id: docs_izm.id
        }
        this.svodDetailService
          .add_docs(this.svod_exp_id, docs)
          .subscribe(
            (detail) => {
              this.svodDetail = detail,
                this.obligats = this.svodDetail.obligats,
                this.payments = this.svodDetail.payments,
                this.addFKRtoPayments()
              this.addFKRtoObligats()
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

  onDelete(id_doc: number, nomer: string) {

    let docs = {
      doc_id: id_doc
    }

    this.svodDetailconfirm.confirm({
      message: 'Удалить документ ' + nomer + '?',
      header: 'Удаление документа',
      icon: 'pi pi-exclamation-triangle',
      accept: () => (
        this.svodDetailService
          .delete_docs(this.svodDetail.doc.id, docs)
          .subscribe(
            (detail) => {
              this.svodDetail = detail,
                this.obligats = this.svodDetail.obligats,
                this.payments = this.svodDetail.payments,
                this.addFKRtoPayments()
              this.addFKRtoObligats()
              this.svodDetailmsg.add({ severity: 'success', summary: 'Успешно', detail: 'Документ успешно удален!' })
              this.svodDetailconfirm.close()
            },
            (error) => {
              this.svodDetailmsg.add({
                severity: 'error', summary: 'Ошибка', detail: error.error.status
              })
            }
          )),
      reject: () => {
        this.svodDetailconfirm.close()
      }
    })
  }

  saveDoc(close: boolean) {

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
