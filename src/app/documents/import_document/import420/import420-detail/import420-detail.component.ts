import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { organization_detail } from 'src/app/directory/organization/interfaces';
import { OrganizationDetailComponent } from 'src/app/directory/organization/organization-detail/organization-detail.component';
import { import420Servise } from '../import420.servise';
import { import420_detail } from '../interfaces';

@Component({
  selector: 'app-import420-detail',
  templateUrl: './import420-detail.component.html',
  styleUrls: ['./import420-detail.component.css']
})
export class Import420DetailComponent implements OnInit {

  uploadedFiles: any[] = [];
  windowHeight: number
  imports: import420_detail
  first = 0
  rows = 25

  @HostListener('window:resize', ['$event'])
  @Input() imp_420_id = ''
  @Output() closeEvent = new EventEmitter<any>()


  constructor(
    private import420_service: import420Servise,
    private import420_message: MessageService,
    private import420_dialog: DialogService,
    private import420_ref: DynamicDialogRef) { }

  ngOnInit(): void {
    if (this.imp_420_id !== '') {
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

    this.import420_service
      .fetch_detail(this.imp_420_id, params)
      .subscribe(
        (data) => (this.imports = data),
        (error) => (this.import420_message.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status }))
      )
  }

  viewOrg() {
    this.import420_ref = this.import420_dialog.open(OrganizationDetailComponent,
      {
        header: 'Редактирование организации',
        width: '60%',
        height: '80%',
        data: { org_id: this.imports.doc._organization.id }
      })

    this.import420_ref.onClose.subscribe((org: organization_detail) => {
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
