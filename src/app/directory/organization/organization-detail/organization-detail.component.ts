import { Component, HostListener, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrganizationsService } from '../organization.service';
import { organization_list, organization_detail } from '../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudjetSelectComponent } from '../../income/budjet/budjet-select/budjet-select.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Budjet_detail } from '../../income/budjet/interfaces';
import { OrganizationSelectComponent } from '../organization-select/organization-select.component';
import { profileuser } from 'src/app/login/interfaces';
import { PeriodDetailComponent } from '../../period/period-detail/period-detail.component';
import { abp_detail } from '../../expenses/ABP/interfaces';
import { ABPSelectComponent } from '../../expenses/ABP/abp-select/abp-select.component';
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
    private period_dialog_ref: DynamicDialogRef,
    private budjet_ref: DynamicDialogRef,
    public org_dialog_config: DynamicDialogConfig,
    private org_dialog_servis: DialogService) {
  }

  form: FormGroup
  org_id = 0
  _date = new Date
  saved = false
  windowHeight: number
  org_detail: organization_detail = {
    id: 0,
    bin: '',
    name_kaz: '',
    name_rus: '',
    adress: '',
    codeorg: '',
    is_abp: false,
    deleted: false,
    _region: '',
    regions: [{
      name: ''
    }],
    _budjet: {
      id: 0,
      code: '',
      name_kaz: '',
      name_rus: '',
      adress: ''
    },
    _abp: {
      id: 0,
      code: '',
      name_kaz: '',
      name_rus: ''
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
  is_abp = true
  abp_full_name = ''
  regiontypes: any = []

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize(),
      this.updateWindowSize()
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      bin: new FormControl(null, [Validators.required]),
      codeorg: new FormControl(null, [Validators.required]),
      budjet_name: new FormControl(null, [Validators.required]),
      _region: new FormControl(null, [Validators.required]),
      abp_name: new FormControl(null, [Validators.required]),
      is_abp: new FormControl(null),
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
            this.updateWindowSize(),
            this.abp_full_name = this.org_detail._abp.code + ' ' + this.org_detail._abp.name_rus
          )
        )
    }
    else {

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
        this.SelectPeriod(org)
      }
    })
  }

  SelectPeriod(org: organization_detail) {
    this.period_dialog_ref = this.org_dialog_servis.open(PeriodDetailComponent,
      {
        header: 'Выбор периода',
        width: '40%',
        height: '40%'
      })
    this.period_dialog_ref.onClose.subscribe((date: any) => {
      if (date) {
        let new_date = this.toLocaleDate(date)

        let params = {
          _organization_id: this.org_detail.id,
          _parent_id: org.id,
          _date: new_date
        }

        let resp: any
        this.orgService
          .parent_organization_add(params)
          .subscribe(
            (data) => (resp = data,
              this.PushtoTable(org, resp.id, new_date),
              this.org_message.add({ severity: 'success', summary: 'Ошибка', detail: resp.status })),
            (error) => (this.org_message.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status }))
          )

      }
    }
    )
  }

  PushtoTable(org: organization_detail, id_str: number, date: string) {
    this.org_detail.parent_organizations.push({
      id: id_str,
      _date: date,
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
        this.org_confirm.close()
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

  addABP() {
    this.budjet_ref = this.org_dialog_servis.open(ABPSelectComponent,
      {
        header: 'Выбрать АБП',
        width: '70%',
        height: '80%'
      })

    this.budjet_ref.onClose.subscribe((abp_detail: abp_detail) => {
      if (abp_detail) {
        this.org_detail._abp = abp_detail,
          this.abp_full_name = this.org_detail._abp.code + ' ' + this.org_detail._abp.name_rus
      }
    })
  }

  closeOrg() {
    this.org_dialog_ref.close()
  }
}
