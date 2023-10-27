import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { import219_detail } from '../interfaces';
import { import219Servise } from '../import219.servise';
import { Observable } from 'rxjs';
import { organization_detail } from 'src/app/directory/organization/interfaces';
import { OrganizationDetailComponent } from 'src/app/directory/organization/organization-detail/organization-detail.component';


@Component({
  selector: 'app-import219-detail',
  templateUrl: './import219-detail.component.html',
  styleUrls: ['./import219-detail.component.css']
})

export class Import219DetailComponent implements OnInit {

  uploadedFiles: any[] = [];
  windowHeight: number
  imports: import219_detail

  @HostListener('window:resize', ['$event'])
  @Input() imp_219_id = ''
  @Output() closeEvent = new EventEmitter<any>()


  constructor(
    private import219_service: import219Servise,
    private import219_message: MessageService,
    private import219_dialog: DialogService,
    private import219_ref: DynamicDialogRef) { }

  ngOnInit(): void {
    if (this.imp_219_id !== '') {
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
    this.import219_service
      .fetch_detail(this.imp_219_id)
      .subscribe(
        (data) => (
          this.imports = data
        ),
        (error) => (this.import219_message.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status }))
      )
  }

  viewOrg() {
    this.import219_ref = this.import219_dialog.open(OrganizationDetailComponent,
      {
        header: 'Редактирование организации',
        width: '60%',
        height: '80%',
        data: { org_id: this.imports.doc._organization.id }
      })

    this.import219_ref.onClose.subscribe((org: organization_detail) => {
      if (org) {
        this.imports.doc._organization.id = org.id,
          this.imports.doc._organization.name_rus = org.name_rus
      }
    })
  }

  closeform() {
    this.closeEvent.emit()
  }
}
