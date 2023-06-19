import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { organization_list, organization_detail } from '../interfaces';
import { OrganizationsService } from '../organization.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrganizationDetailComponent } from '../organization-detail/organization-detail.component'
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  constructor(
    private orgService: OrganizationsService,
    private org_dialog_ref: DynamicDialogRef,
    private org_dialog_servis: DialogService,
  ) { }

  @Input() data = false
  organizations$: Observable<organization_list>
  first = 0
  rows = 3
  searchorg = ''

  Pusti_dannye: organization_detail = {
    id: 0,
    bin: '',
    budjet_name: '',
    name_kaz: '',
    name_rus: '',
    adress: '',
    _budjet: 0
  }


  ngOnInit() {
    this.fetchOrg()
  }

  fetchOrg() {

    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.organizations$ = this.orgService.fetch(params)

  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchOrg()
  }

  onRowEdit(org: any) {

    this.org_dialog_ref = this.org_dialog_servis.open(OrganizationDetailComponent,
      {
        header: 'Редактирование организации',
        width: '60%',
        height: '50%',
        data: { organizations: org }
      })

    this.org_dialog_ref.onClose.subscribe((save: boolean) => {
      if (save) {
        this.fetchOrg()
      }
    })

  }

  onRowClick(org: organization_detail) {
    if (this.data) {
      this.onRowEdit(org)
    }
    else {
      this.org_dialog_ref.close(org)
    }
  }

  search() {

  }

  openNew() {
    this.Pusti_dannye = {
      id: 0,
      bin: '',
      budjet_name: '',
      name_kaz: '',
      name_rus: '',
      adress: '',
      _budjet: 0
    }
    this.org_dialog_ref = this.org_dialog_servis.open(OrganizationDetailComponent,
      {
        header: 'Создание организации',
        width: '60%',
        height: '50%',
        data: { organizations: this.Pusti_dannye }
      })
  }

}
