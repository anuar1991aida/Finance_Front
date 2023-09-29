import { Component, HostListener, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrganizationsService } from '../organization.service';
import { organization_list, organization_detail } from '../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudjetSelectComponent } from '../../income/budjet/budjet-select/budjet-select.component';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Budjet_detail } from '../../income/budjet/interfaces';
import { OrganizationSelectComponent } from '../organization-select/organization-select.component';
@Component({
  selector: 'app-organization-detail',
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.css']
})
export class OrganizationDetailComponent implements OnInit {

  constructor(
    private orgService: OrganizationsService,
    private org_confirm: ConfirmationService,
    private org_message: MessageService,
    private org_dialog_ref: DynamicDialogRef,
    private budjet_ref: DynamicDialogRef,
    public org_dialog_config: DynamicDialogConfig,
    private org_dialog_servis: DialogService) { }

  form: FormGroup
  org_id = 0
  _date = new Date
  saved = false
  // org_detail: organization_detail = {}
  windowHeight: number
  // budj_det: Budjet_detail = {
  //   id: 0,
  //   code: '',
  //   name_kaz: '',
  //   name_rus: '',
  //   adress: ''
  // }
  org_detail: organization_detail = {
    id: 0,
    bin: '',
    name_kaz: '',
    name_rus: '',
    adress: '',
    _budjet: {
      id: 0,
      code: '',
      name_kaz: '',
      name_rus: '',
      adress: ''
    },
    parent_organizations: [{
      id: 0,
      _date: '',
      _organization: 0,
      _parent: {
        id: 0,
        name_rus: ''
      }
    }]
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize(),
      this.updateWindowSize()
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
          (data) => (
            this.org_detail = data,
            this.updateWindowSize()
          )
        )
    }


  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight;
  }

  addOrg() {
    this.org_dialog_ref = this.org_dialog_servis.open(OrganizationSelectComponent,
      {
        header: 'Выбор организации',
        width: '60%',
        height: '80%'
      })

    this.org_dialog_ref.onClose.subscribe((org: organization_detail) => {
      if (org) {
        let params = {
          _organization_id: this.org_detail.id,
          _parent_id: org.id,
          _date: '01.01.2023 00:00:00'
        }

        let resp: any
        this.orgService
          .parent_organization_add(params)
          .subscribe(
            (data) => (resp = data,
              this.PushtoTable(org, resp.id),
              this.org_message.add({ severity: 'success', summary: 'Ошибка', detail: resp.status })),
            (error) => (this.org_message.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status }))
          )
      }
    })
  }

  PushtoTable(org: organization_detail, id_str: number) {
    this.org_detail.parent_organizations.push({
      id: id_str,
      _date: '01.01.2023 00:00:00',
      _organization: this.org_detail.id,
      _parent: {
        id: org.id,
        name_rus: org.name_rus
      }
    })
  }

  delParent(ri: number, id: number, org_name: string) {

    this.org_confirm.confirm({
      message: 'Удалить с родителя ' + org_name + '?',
      header: 'Удаление родителя',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let resp: any;

        this.orgService
          .parent_organization_del(id)
          .subscribe(
            (data) => (resp = data,
              this.org_detail.parent_organizations.splice(ri, 1),
              this.org_message.add({ severity: 'success', summary: 'Ошибка', detail: resp.status })),
            (error) => (this.org_message.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status }))
          )
      },
      reject: () => {
        this.org_confirm.close();
      }
    })


  }

  toLocaleDate(dateForStr: string) {
    return new Date(dateForStr).toLocaleDateString() + ' ' + new Date(dateForStr).toLocaleTimeString();
  }


  saveOrg() {
    this.orgService.add(this.org_detail)
      .subscribe(
        (data) => (
          this.org_message.add({ severity: 'success', summary: 'Успешно', detail: 'Организация сохранена!' }),
          this.closeOrg()
        ),
        (error) => (this.org_message.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })))
  }

  addClassification() {
    this.budjet_ref = this.org_dialog_servis.open(BudjetSelectComponent,
      {
        header: 'Выбрать бюджет',
        width: '70%',
        height: '80%'
      })

    this.budjet_ref.onClose.subscribe((budjet: Budjet_detail) => {
      if (budjet) {
        this.org_detail._budjet = budjet
      }
    })
  }

  closeOrg() {
    this.org_dialog_ref.close()
  }
}
