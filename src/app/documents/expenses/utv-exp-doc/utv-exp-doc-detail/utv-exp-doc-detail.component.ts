import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { utv_expenses_detail } from '../interfaces';
import { UtvExpensesService } from '../utv_expenses.service';

@Component({
  selector: 'app-utv-exp-doc-detail',
  templateUrl: './utv-exp-doc-detail.component.html',
  styleUrls: ['./utv-exp-doc-detail.component.css']
})
export class UtvExpDocDetailComponent implements OnInit {

  constructor(
    private utvDetailService: UtvExpensesService,
    private utvDetailmsg: MessageService,
    private utvDetailref: DynamicDialogRef,
    private utvDetaildialog: DialogService,
    private utvDetailconfirm: ConfirmationService,
  ) {
    this.items = [
      {
        label: 'Записать',
        icon: 'pi pi-save',
        command: () => {

        }
      },
      // {
      //   label: 'Пометка на удаление',
      //   icon: 'pi pi-times',
      //   command: () => {
      //     this.onDelete();
      //   }
      // }
    ]
  }

  @Input() utv_exp_id = ''
  @Output() closeEvent = new EventEmitter<any>();

  items: MenuItem[]
  form: FormGroup
  obligats: any = []
  payments: any = []
  allrecord = true
  _lastfkr = 0
  firstclick = true

  utvDetail: utv_expenses_detail = {
    doc: {
      id: 0,
      org_name: '',
      budjet_name: '',
      nom: '',
      _date: '',
      deleted: false,
      _organization: 0,
      _budjet: 0
    },
    payments: [{
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
      fkr_name: '',
      fkr_code: '',
      spec_name: '',
      spec_code: '',
      _date: '',
      _utv_exp: 0,
      _organization: 0,
      _fkr: 0,
      _spec: 0
    }],
    obligats: [{
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
      fkr_name: '',
      fkr_code: '',
      spec_name: '',
      spec_code: '',
      _date: '',
      _utv_exp: 0,
      _organization: 0,
      _fkr: 0,
      _spec: 0
    }]
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      number_doc: new FormControl(null, [Validators.required]),
      date_doc: new FormControl(null, [Validators.required]),
      org_name: new FormControl(null, [Validators.required]),
      budjet_name: new FormControl(null, [Validators.required])
    })
    if (this.utv_exp_id !== '') {
      this.utvDetailService.fetch_detail(parseInt(this.utv_exp_id))
        .subscribe(
          (detail) => {
            this.utvDetail = detail,
              this.obligats = this.utvDetail.obligats,
              this.payments = this.utvDetail.payments
          }
        )
    }

  }


  saveDoc(close: boolean) {

  }

  filterFKR(_fkr: number) {
    if (this.firstclick) {
      this._lastfkr = _fkr
      this.firstclick = false
    }

    if (this._lastfkr == _fkr) {
      this.allrecord = !this.allrecord
    }
    else {
      this.allrecord = false
    }



    if (!this.allrecord) {
      this.obligats = this.utvDetail.obligats.filter(item => item['_fkr'] === _fkr)
      this.payments = this.utvDetail.payments.filter(item => item['_fkr'] === _fkr)
    }
    else {
      this.obligats = this.utvDetail.obligats
      this.payments = this.utvDetail.payments
    }

    this._lastfkr = _fkr

  }

  changedate() {
    this.utvDetail.doc._date = this.toLocaleDate(this.utvDetail.doc._date)
  }

  toLocaleDate(dateForStr: string) {
    return new Date(dateForStr).toLocaleDateString() + ' ' + new Date(dateForStr).toLocaleTimeString();
  }

  closeform(close: boolean) {

  }

}
