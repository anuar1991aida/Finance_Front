import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { organization_detail } from 'src/app/directory/organization/interfaces';
import { OrganizationDetailComponent } from 'src/app/directory/organization/organization-detail/organization-detail.component';
import { import127Servise } from '../import127.servise';
import { import127_detail } from '../interfaces';

@Component({
  selector: 'app-import127-detail',
  templateUrl: './import127-detail.component.html',
  styleUrls: ['./import127-detail.component.css']
})
export class Import127DetailComponent implements OnInit {

  uploadedFiles: any[] = [];
  windowHeight: number
  imports: import127_detail
  first = 0
  rows = 25

  @HostListener('window:resize', ['$event'])
  @Input() imp_127_id = ''
  @Output() closeEvent = new EventEmitter<any>()


  constructor(
    private import127_service: import127Servise,
    private import420_message: MessageService,
    private import420_dialog: DialogService,
    private import420_ref: DynamicDialogRef) { }

  ngOnInit(): void {
    if (this.imp_127_id !== '') {
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

    this.import127_service
      .fetch_detail(this.imp_127_id, params)
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
