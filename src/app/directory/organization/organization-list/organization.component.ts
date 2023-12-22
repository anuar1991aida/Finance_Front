import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { organization_list, organization_detail } from '../interfaces';
import { OrganizationsService } from '../organization.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrganizationDetailComponent } from '../organization-detail/organization-detail.component'
import { ConfirmationService, MessageService } from 'primeng/api';
import { MainComponent } from 'src/app/main/main.component/main.component';
import { profileuser } from 'src/app/login/interfaces';
import { Tree } from 'primeng/tree';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})

export class OrganizationComponent implements OnInit {

  constructor(
    private MainComponent: MainComponent,
    private orgService: OrganizationsService,
    private orgListconfirm: ConfirmationService,
    private org_dialog_ref: DynamicDialogRef,
    private orgListmessageService: MessageService,
    private org_dialog_servis: DialogService,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows,
      this.profileuser = this.MainComponent.profileuser
  }

  @Output() closeEvent = new EventEmitter<any>()
  @Input() list = false
  @Input() tabcount = 0
  organizations$: Observable<organization_list>
  profileuser: profileuser
  first = 0
  rows = 25
  searchorg = ''
  selected: any
  windowHeight: number
  old_tabcount = 0
  node:Node

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize()
  }

  ngOnInit() {
    this.old_tabcount = this.tabcount
    this.fetchOrg()
    this.updateWindowSize()
  }

  ngOnChanges(): void {
    if (this.tabcount == this.old_tabcount) {
      this.fetchOrg()
    }
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight;
  }

  closeform() {
    this.closeEvent.emit()
  }

  fetchOrg() {

    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString(),
      search: this.searchorg,
      list: this.list
    }

    this.organizations$ = this.orgService.fetch(params)

  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchOrg()
  }

  onRowEdit(org: organization_detail) {

    this.org_dialog_ref = this.org_dialog_servis.open(OrganizationDetailComponent,
      {
        header: 'Редактирование организации',
        width: '60%',
        height: '60%',
        data: { org_id: org.id }
      })

    this.org_dialog_ref.onClose.subscribe((save: boolean) => {

      if (save) {
        this.fetchOrg()
      }
    })

  }

  onRowClick(org: organization_detail) {
    if (this.list) {
      this.onRowEdit(org)
    }
    else {
      this.org_dialog_ref.close(org)
    }
  }

  onSelected(org: organization_detail) {
    if (!this.selected) {
      this.orgListmessageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите организацию!' })
      return
    }
    this.org_dialog_ref.close(org)
  }

  onDeleteOrg(org: organization_detail) {
    let msg = !org.deleted ? "Пометить " + org.name_rus + " на удаление?" : "Снять с " + org.name_rus + " пометку на удаление?"
    let header = !org.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    let msgsuccess = !org.deleted ? "Организация помечена на удаление" : "С организации снята пометка на удаление"

    this.orgListconfirm.confirm({
      message: msg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orgService.organization_del(org.id)
          .subscribe((data) => (
            this.orgListmessageService.add({ severity: 'success', summary: 'Успешно', detail: msgsuccess }),
            this.fetchOrg(),
            this.orgListconfirm.close()
          ),
            (error) => (
              this.orgListmessageService.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
            )
          )
      },
      reject: () => {
        this.orgListconfirm.close();
      }
    });
  }

  setClass(deleted: boolean) {
    let classs = ''

    if (deleted) {
      classs = 'class-deleted'
    }

    return classs

  }

  openNew() {
    this.org_dialog_ref = this.org_dialog_servis.open(OrganizationDetailComponent,
      {
        header: 'Создание организации',
        width: '60%',
        height: '60%',
        data: { org_id: 0 }
      })

    this.org_dialog_ref.onClose.subscribe((save: boolean) => {
      if (save) {
        this.fetchOrg()
      }
    })

  }

}
