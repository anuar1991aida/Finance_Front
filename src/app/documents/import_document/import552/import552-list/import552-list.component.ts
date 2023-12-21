import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MainComponent } from 'src/app/main/main.component/main.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { import552Servise } from '../import552.servise';
import { profileuser } from 'src/app/login/interfaces';
import { Observable } from 'rxjs';
import { import552_doc, import552_list } from '../import552.interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadComponent } from 'src/app/services/upload/upload.component';

@Component({
  selector: 'app-import552-list',
  templateUrl: './import552-list.component.html',
  styleUrls: ['./import552-list.component.css']
})
export class Import552ListComponent implements OnInit {

  constructor(
    private MainComponent: MainComponent,
    private service552: import552Servise,
    private import552_confirm: ConfirmationService,
    private msgService552: MessageService,
    private import552_dialog_ref: DynamicDialogRef,
    private import552_dialog_servis: DialogService,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows,
      this.profileuser = this.MainComponent.profileuser
  }

  @HostListener('window:resize', ['$event'])
  @Output() closeEvent = new EventEmitter<any>()
  @Output() newItemEvent = new EventEmitter<any>();
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'Delete') {
      this.massDelete(true)
    }
    else if (event.key === 'Delete') {
      this.massDelete(false)
    }
  }

  imports$: Observable<import552_list>
  profileuser: profileuser
  first = 0
  rows = 25
  searchimport = ''
  windowHeight: number
  selectedDocs!: any

  ngOnInit(): void {
    this.fetchImport()
  }

  fetchImport() {

    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString(),
      search: this.searchimport
    }

    this.imports$ = this.service552.fetch(params)

  }

  massDelete(shift: boolean) {

    if (this.selectedDocs) {
      let msg = !shift ? "Пометить документы на удаление?" : "Вы точно хотите удалить документы?"
      let header = !shift ? "Пометка на удаление" : "Удаление документов"
      let msgsuccess = !shift ? "Документы помечены на удаление" : "Документы удалены"

      let mass_doc_id = []

      for (let i = 0; i < this.selectedDocs.length; i++) {
        mass_doc_id.push(this.selectedDocs[i].id)
      }

      let body = {
        shift: shift,
        mass_doc_id: mass_doc_id
      }

      this.deleteService(msg, header, msgsuccess, body)
    }
    else {
      this.msgService552.add({ severity: 'error', summary: 'Ошибка', detail: 'Документ не выбран' })
    }
  }

  onDelete(import_552: import552_doc) {

    if (this.selectedDocs && this.selectedDocs.length !== 1) {
      this.msgService552.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите только один документ!' })
      return
    }

    let msg = !import_552.deleted ? "Пометить " + import_552.nom + " на удаление?" : "Снять с " + import_552.nom + " пометку на удаление?"
    let header = !import_552.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    let msgsuccess = !import_552.deleted ? "Документ помечен на удаление" : "С документа снята пометка на удаление"

    let body = {
      shift: false,
      mass_doc_id: [import_552.id]
    }

    this.deleteService(msg, header, msgsuccess, body)
  }

  deleteService(msg: string, header: string, msgsuccess: string, body: any) {
    this.import552_confirm.confirm({
      message: msg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service552
          .delete_import552(body)
          .subscribe((data) => (
            this.msgService552.add({ severity: 'success', summary: 'Успешно', detail: msgsuccess }),
            this.fetchImport(),
            this.import552_confirm.close()
          ),
            (error) => (
              this.msgService552.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
            )
          )
      },
      reject: () => {
        this.import552_confirm.close();
      }
    })
  }

  onRowClick(imp: import552_doc) {
    this.newItemEvent.emit({ params: { selector: 'app-import552-element', nomer: 'Импорт 5-52 №' + imp.nom, id: imp.id } })
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

  import552() {
    this.import552_dialog_ref = this.import552_dialog_servis.open(UploadComponent, {
      header: 'Загрузка PDF',
      width: 'calc(50%)',
      height: 'calc(50%)',
      data: { type_import: '5_52' }
    })
    this.import552_dialog_ref.onClose.subscribe((success: boolean) => {

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
