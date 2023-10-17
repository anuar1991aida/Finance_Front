import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MainComponent } from 'src/app/main/main.component/main.component';
import { profileuser } from 'src/app/login/interfaces';
import { import219Servise } from '../import219.servise';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { import219_list, import219_detail, import219_doc } from '../interfaces';
import { Observable } from 'rxjs';
import { UploadComponent } from 'src/app/services/upload/upload.component';

@Component({
  selector: 'app-import219-list',
  templateUrl: './import219-list.component.html',
  styleUrls: ['./import219-list.component.css']
})
export class Import219ListComponent implements OnInit {

  constructor(
    private MainComponent: MainComponent,
    private import219_service: import219Servise,
    private import219_confirm: ConfirmationService,
    private import219_dialog_ref: DynamicDialogRef,
    private import219_messageService: MessageService,
    private import219_dialog_servis: DialogService,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows,
      this.profileuser = this.MainComponent.profileuser
  }

  @HostListener('window:resize', ['$event'])
  @Output() closeEvent = new EventEmitter<any>()
  @Output() newItemEvent = new EventEmitter<any>();
  @Input() list = false

  imports$: Observable<import219_list>
  profileuser: profileuser
  first = 0
  rows = 25
  searchimport = ''
  windowHeight: number

  ngOnInit(): void {

    this.fetchImport()

  }

  fetchImport() {

    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString(),
      search: this.searchimport,
      list: false
    }

    this.imports$ = this.import219_service.fetch(params)

  }

  onRowClick(imp: import219_doc) {
    this.newItemEvent.emit({ params: { selector: 'app-import219-detail', nomer: 'Импорт 2-19 №' + imp.nom, id: imp.id } })
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchImport()
  }

  setClass(deleted: boolean) {
    let classs = ''

    if (deleted) {
      classs = 'class-deleted'
    }

    return classs

  }

  import219() {
    this.import219_dialog_ref = this.import219_dialog_servis.open(UploadComponent, {
      header: 'Загрузка PDF',
      width: 'calc(50%)',
      height: 'calc(50%)',
      data: { type_import: '2_19' }
    })
    this.import219_dialog_ref.onClose.subscribe((success: boolean) => {

      if (success) {
        this.fetchImport()
      }
    })
  }

  closeform() {
    this.closeEvent.emit()
  }

  onResize(event: Event) {
    this.updateWindowSize()
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight;
  }

}
