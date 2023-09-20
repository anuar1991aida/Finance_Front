import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { IzmIncomeService } from 'src/app/documents/income/izm_inc_doc/izm_income.service';
import { izm_plateji_detail } from '../interfaces';
import { IzmPlatezhiService } from '../izm-plateji.services';

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
  ) { }

  @Input() izm_inc_id = ''
  @Output() closeEvent = new EventEmitter<any>()
  @Output() closeed = false

  items: MenuItem[]
  form: FormGroup
  obligats: any = []
  payments: any = []
  spravkatypes: any = []
  izmPlatezhiDetail: izm_plateji_detail
  responce: any
  nochanged = true
  hashBegin = ''
  hashEnd = ''
  firstclick = true
  _lastfkr = 0
  allrecord = true

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

  ngOnInit(): void {
    this.form = new FormGroup({
      number_doc: new FormControl(null, [Validators.required]),
      date_doc: new FormControl(null, [Validators.required]),
      org_name: new FormControl(null, [Validators.required]),
      type_name: new FormControl(null, [Validators.required])
    })

    this.gettypespr()

    if (this.izm_inc_id !== '') {
      this.izmPlatezhiDetailService.fetch_detail(this.izm_inc_id)
        .subscribe(
          (detail) => {
            this.izmPlatezhiDetail = detail,
              this.payments = this.izmPlatezhiDetail.payments,
              this.obligats = this.izmPlatezhiDetail.obligats,
              this.addFKRtoArray()
            // this.calculatetot()
          }
        )
    }
    else {
      this.izmPlatezhiDetail = {
        doc: {
          id: 0,
          nom: '',
          _date: '',
          deleted: false,
          doc_hash: '',
          _organization: {
            id: 0,
            bin: '',
            name_kaz: '',
            name_rus: '',
            adress: '',
            _budjet: this.budj_det
          },
          _type_izm_doc: {
            id: 0,
            name_kaz: '',
            name_rus: ''
          }
        },
        payments: [{
          id: 0,
          _fkr: this.fkr_detail,
          _spec: this.spec_detail,
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
          itog12: 0
        }],
        obligats: [{
          id: 0,
          _fkr: this.fkr_detail,
          _spec: this.spec_detail,
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
          itog12: 0
        }]
      }

      this.izmPlatezhiDetail.payments.splice(0, this.izmPlatezhiDetail.payments.length)
    }

    let objString = JSON.stringify(this.izmPlatezhiDetail)
    this.hashBegin = SHA256(objString).toString()
  }

  addFKRtoArray() {
    this.fkr_array = []

    for (let i = 0; i < this.izmPlatezhiDetail.payments.length; i++) {

      let index = this.fkr_array.findIndex(item => this.izmPlatezhiDetail.payments[i]._fkr.id === item.id)

      if (index !== -1) {
        continue
      }

      this.fkr_array.push({
        id: this.izmPlatezhiDetail.payments[i]._fkr.id,
        code: this.izmPlatezhiDetail.payments[i]._fkr.code,
        name_kaz: this.izmPlatezhiDetail.payments[i]._fkr.name_kaz,
        name_rus: this.izmPlatezhiDetail.payments[i]._fkr.name_rus,
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
    // if (this.spravkatypes.length == 0) {
    //   this.izmDetailService.gettypespr()
    //     .subscribe(
    //       (data) => (
    //         this.spravkatypes = data
    //       )
    //     )
    // }
  }

  delSpec(utv: any) {

    for (let i = this.izmPlatezhiDetail.obligats.length - 1; i >= 0; i--) {
      let index = this.izmPlatezhiDetail.obligats.findIndex(item => utv.id === item.id)
      if (index !== -1) {
        this.izmPlatezhiDetail.obligats.splice(index, 1)
      }
    }
    for (let i = this.izmPlatezhiDetail.payments.length - 1; i >= 0; i--) {
      let index = this.izmPlatezhiDetail.payments.findIndex(item => utv.id === item.id)
      if (index !== -1) {
        this.izmPlatezhiDetail.payments.splice(index, 1)
      }
    }

    this.obligats = this.izmPlatezhiDetail.obligats.filter(item => item['_fkr'].id == utv._fkr.id)
    this.payments = this.izmPlatezhiDetail.payments.filter(item => item['_fkr'].id == utv._fkr.id)

    this.addFKRtoArray()
  }

  addFKR() {
    this.izmPlatezhiDetailref = this.izmPlatezhiDetaildialog.open(FkrSelectComponent,
      {
        header: 'Выбор ФКР',
        width: '60%',
        height: '80%'
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
    if (fkr_detail !== undefined) {
      this.izmPlatezhiDetailref = this.izmPlatezhiDetaildialog.open(SpecificationExpSelectComponent,
        {
          header: 'Выбор спецификации',
          width: '60%',
          height: '80%'
        })
      this.izmPlatezhiDetailref.onClose.subscribe((spec_detail: specification_income_detail) => {
        if (spec_detail) {
          if (payments)
            this.pushArray(fkr_detail, spec_detail, this.izmPlatezhiDetail.payments)
          this.payments = this.izmPlatezhiDetail.payments.filter(item => item['_fkr'].id == fkr_detail.id)
        }
      }
      )
    }
    else {
      this.izmPlatezhiDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите ФКР!' })
      return

    }
  }

  addSpecToObligats(fkr_detail: fkr_detail) {
    if (fkr_detail !== undefined) {
      this.izmPlatezhiDetailref = this.izmPlatezhiDetaildialog.open(SpecificationExpSelectComponent,
        {
          header: 'Выбор спецификации',
          width: '60%',
          height: '80%'
        })
      this.izmPlatezhiDetailref.onClose.subscribe((spec_detail: specification_income_detail) => {
        if (spec_detail) {
          this.pushArray(fkr_detail, spec_detail, this.izmPlatezhiDetail.obligats)
          this.obligats = this.izmPlatezhiDetail.obligats.filter(item => item['_fkr'].id == fkr_detail.id)
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
        _fkr: {
          id: fkr_detail.id,
          code: fkr_detail.code,
          name_kaz: fkr_detail.name_kaz,
          name_rus: fkr_detail.name_rus
        },
        _spec: {
          id: spec_detail.id,
          code: spec_detail.code,
          name_kaz: spec_detail.name_kaz,
          name_rus: spec_detail.name_rus
        }
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
      this.obligats = this.izmPlatezhiDetail.obligats.filter(item => item['_fkr'].id == _fkr.id)
      this.payments = this.izmPlatezhiDetail.payments.filter(item => item['_fkr'].id == _fkr.id)

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

  saveDoc(close: boolean) {

  }

  selectOrg() {

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
  }

  toLocaleDate(dateForStr: string) {
    return new Date(dateForStr).toLocaleDateString() + ' ' + new Date(dateForStr).toLocaleTimeString();
  }

  closeform(close: boolean) {

    // let objString = JSON.stringify(this.utvDetail)
    // this.hashEnd = SHA256(objString).toString()

    // if (close) {
    //   if (this.hashBegin == this.hashEnd) {
    //     this.closeEvent.emit()
    //   }
    //   else {
    //     this.utvDetailconfirm.confirm({
    //       message: 'Данные были изменены. Закрыть документ?',
    //       header: 'Закрытие',
    //       icon: 'pi pi-exclamation-triangle',
    //       accept: () => {
    //         this.closeEvent.emit()
    //         this.utvDetailconfirm.close()
    //       },
    //       reject: () => {
    //         this.utvDetailconfirm.close()
    //       }
    //     })
    //   }
    // }
  }

}
