import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { catchError, Observable, switchAll, switchMap, take, throwError, timeout } from 'rxjs';
import { utv_income_detail } from '../interfaces';
import { UtvIncomeService } from '../utv_income.service';

@Component({
  selector: 'app-utv-income-detail',
  templateUrl: './utv-income-detail.component.html',
  styleUrls: ['./utv-income-detail.component.css']
})
export class UtvIncomeDetailComponent implements OnInit {

  constructor(
    private utvDetailService: UtvIncomeService,
    private utvDetailmsg: MessageService
  ) {
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => {
          // this.saveDoc();
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
        command: () => {
          // this.saveDoc();
        }
      },
      { label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io' },
      { separator: true },
      { label: 'Setup', icon: 'pi pi-cog', routerLink: ['/setup'] }
    ]
  }

  @Input() utv_inc_id = ''
  @Output() closeEvent = new EventEmitter<any>();

  items: MenuItem[];
  form: FormGroup
  utvDetail: utv_income_detail
  responce: any

  ngOnInit(): void {
    this.form = new FormGroup({
      number_doc: new FormControl(null, [Validators.required]),
      date_doc: new FormControl(null, [Validators.required]),
      org_name: new FormControl(null, [Validators.required]),
      budjet_name: new FormControl(null, [Validators.required])
    })

    this.utvDetailService.fetch_detail(this.utv_inc_id)
      .subscribe(
        (detail) => {
          this.utvDetail = detail
        }
      )



    // this.utvDetail$ = this.utvDetailService.fetch_detail(this.utv_inc_id)
  }

  saveDoc(close: boolean): void {

    this.utvDetailService.saveUtv(this.utvDetail)
      .subscribe(
        () => (
          this.utvDetailmsg.add({ severity: 'success', summary: 'Успешно', detail: 'Документ успешно записан!' }),
          this.closeform(close)
        ),
        (error) => (
          this.utvDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
        )
      )
  }

  changedate() {
    this.utvDetail.doc._date = this.toLocaleDate(this.utvDetail.doc._date)
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
