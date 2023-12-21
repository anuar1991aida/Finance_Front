import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { organization_detail } from 'src/app/directory/organization/interfaces';
import { OrganizationDetailComponent } from 'src/app/directory/organization/organization-detail/organization-detail.component';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { import552Servise } from '../import552.servise';
import { import552_detail } from '../import552.interfaces';

@Component({
  selector: 'app-import552-element',
  templateUrl: './import552-element.component.html',
  styleUrls: ['./import552-element.component.css']
})
export class Import552ElementComponent implements OnInit {

  uploadedFiles: any[] = [];
  windowHeight: number
  imports: import552_detail
  first = 0
  rows = 25

  @HostListener('window:resize', ['$event'])
  @Input() imp_552_id = ''
  @Output() closeEvent = new EventEmitter<any>()

  constructor(
    private import552_service: import552Servise,
    private import552_message: MessageService,
    private import552_dialog: DialogService,
    private import552_ref: DynamicDialogRef) { }

  ngOnInit(): void {
    if (this.imp_552_id !== '') {
      this.fetchDetail()
    }
    this.updateWindowSize()
  }

  onResize(event: Event) {
    this.updateWindowSize()
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight;
  }

  fetchDetail() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.import552_service
      .fetch_detail(this.imp_552_id, params)
      .subscribe(
        (data) => (this.imports = data),
        (error) => (this.import552_message.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status }))
      )
  }

  viewOrg() {
    this.import552_ref = this.import552_dialog.open(OrganizationDetailComponent,
      {
        header: 'Редактирование организации',
        width: '60%',
        height: '80%',
        data: { org_id: this.imports.doc._organization.id }
      })

    this.import552_ref.onClose.subscribe((org: organization_detail) => {
      if (org) {
        this.imports.doc._organization.id = org.id,
          this.imports.doc._organization.name_rus = org.name_rus
      }
    })
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchDetail()
  }

  closeform() {
    this.closeEvent.emit()
  }
}
