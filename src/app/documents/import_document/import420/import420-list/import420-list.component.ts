import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MainComponent } from 'src/app/main/main.component/main.component';
import { MessageService } from 'primeng/api';
import { import420Servise } from '../import420.servise';
import { profileuser } from 'src/app/login/interfaces';
import { Observable } from 'rxjs';
import { import420_doc, import420_list } from '../interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadComponent } from 'src/app/services/upload/upload.component';

@Component({
  selector: 'app-import420-list',
  templateUrl: './import420-list.component.html',
  styleUrls: ['./import420-list.component.css']
})
export class Import420ListComponent implements OnInit {

  constructor(
    private MainComponent: MainComponent,
    private service420: import420Servise,
    private msgService420: MessageService,
    private import420_dialog_ref: DynamicDialogRef,
    private import420_dialog_servis: DialogService,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows,
      this.profileuser = this.MainComponent.profileuser
  }

  @HostListener('window:resize', ['$event'])
  @Output() closeEvent = new EventEmitter<any>()
  @Output() newItemEvent = new EventEmitter<any>();

  imports$: Observable<import420_list>
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
      search: this.searchimport
    }

    this.imports$ = this.service420.fetch(params)

  }

  onRowClick(imp: import420_doc) {
    this.newItemEvent.emit({ params: { selector: 'app-import420-detail', nomer: 'Импорт 4-20 №' + imp.nom, id: imp.id } })
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

  import420() {
    this.import420_dialog_ref = this.import420_dialog_servis.open(UploadComponent, {
      header: 'Загрузка PDF',
      width: 'calc(50%)',
      height: 'calc(50%)',
      data: { type_import: '4_20' }
    })
    this.import420_dialog_ref.onClose.subscribe((success: boolean) => {

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
