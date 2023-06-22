import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrganizationsService } from '../organization.service';
import { organization_list, organization_detail } from '../interfaces';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudjetListComponent } from '../../income/budjet/budjet-list/budjet-list.component';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Budjet_detail } from '../../income/budjet/interfaces';
@Component({
  selector: 'app-organization-detail',
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.css']
})
export class OrganizationDetailComponent implements OnInit {

  constructor(
    private orgService: OrganizationsService,
    private org_massage: MessageService,
    private org_dialog_ref: DynamicDialogRef,
    public org_dialog_config: DynamicDialogConfig,
    private org_dialog_servis: DialogService) { }

  form: FormGroup
  org_id = 0
  org_detail: organization_detail = {
    id: 0,
    budjet_name: '',
    bin: '',
    name_kaz: '',
    name_rus: '',
    adress: '',
    _budjet: 0
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      bin: new FormControl(null, [Validators.required]),
      budjet_name: new FormControl(null, [Validators.required]),
      name_kaz: new FormControl(null, [Validators.required]),
      name_rus: new FormControl(null, [Validators.required]),
      adress: new FormControl(null, [Validators.required])
    })

    this.org_id = this.org_dialog_config.data.org_id

    if (this.org_id !== 0) {
      this.orgService.fetchOrg(this.org_id)
        .subscribe(
          (data) => (this.org_detail = data)
        )
    }

  }


  saveOrg() {
    this.orgService.add(this.org_detail)
      .pipe(
        timeout(5000), // установка таймаута на 5 секунд
        catchError(error => {
          if (error.name === 'TimeoutError') {
            this.org_massage.add({ severity: 'error', summary: 'Ошибка', detail: 'Время ожидания истекло. Попробуйте позднее!' });
          }
          else {
            this.org_massage.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить данные!' });
          }
          return throwError('Произошла ошибка: ' + error.message);
        })

      )
      .subscribe(
        (data) => (
          this.org_massage.add({ severity: 'success', summary: 'Успешно', detail: 'Организация сохранена!' }),
          this.org_dialog_ref.close(true)
        ),
        (error) => (this.org_massage.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })))
  }

  addClassification() {
    this.org_dialog_ref = this.org_dialog_servis.open(BudjetListComponent,
      {
        header: 'Выбрать бюджет',
        width: '70%',
        height: '30%'
      })

    this.org_dialog_ref.onClose.subscribe((budjet: Budjet_detail) => {
      if (budjet) {
        this.org_detail.budjet_name = budjet.name_kaz,
          this.org_detail._budjet = budjet.id
      }
    })
  }

  handleClick() {
    this.org_dialog_ref = this.org_dialog_servis.open(BudjetListComponent,
      {
        header: 'Выбрать бюджет',
        width: '70%',
        height: '30%'
      })

    this.org_dialog_ref.onClose.subscribe((budjet: any) => {
      if (budjet) {
        this.org_detail.budjet_name = budjet.name_kaz,
          this.org_detail._budjet = budjet.id
      }
    })

  }

  closeOrg(save: boolean) {
    this.org_dialog_ref.close(save)
  }
}
