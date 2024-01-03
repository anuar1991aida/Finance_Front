import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MainComponent } from 'src/app/main/main.component/main.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { import127Servise } from '../import127.servise';
import { profileuser } from 'src/app/login/interfaces';
import { Observable } from 'rxjs';
import { import127_doc, import127_list } from '../interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadComponent } from 'src/app/services/upload/upload.component';

@Component({
  selector: 'app-import127-list',
  templateUrl: './import127-list.component.html',
  styleUrls: ['./import127-list.component.css']
})
export class Import127ListComponent implements OnInit {

  constructor(
    private MainComponent: MainComponent,
    private service127: import127Servise,
    private import420_confirm: ConfirmationService,
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
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'Delete') {
      this.massDelete(true)
    }
    else if (event.key === 'Delete') {
      this.massDelete(false)
    }
  }

  imports$: Observable<import127_list>
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

    this.imports$ = this.service127.fetch(params)

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
      this.msgService420.add({ severity: 'error', summary: 'Ошибка', detail: 'Документ не выбран' })
    }
  }

  onDelete(import_420: import127_doc) {

    if (this.selectedDocs && this.selectedDocs.length !== 1) {
      this.msgService420.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите только один документ!' })
      return
    }

    let msg = !import_420.deleted ? "Пометить " + import_420.nom + " на удаление?" : "Снять с " + import_420.nom + " пометку на удаление?"
    let header = !import_420.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    let msgsuccess = !import_420.deleted ? "Документ помечен на удаление" : "С документа снята пометка на удаление"

    let body = {
      shift: false,
      mass_doc_id: [import_420.id]
    }

    this.deleteService(msg, header, msgsuccess, body)
  }

  deleteService(msg: string, header: string, msgsuccess: string, body: any) {
    this.import420_confirm.confirm({
      message: msg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service127
          .delete_import127(body)
          .subscribe((data) => (
            this.msgService420.add({ severity: 'success', summary: 'Успешно', detail: msgsuccess }),
            this.fetchImport(),
            this.import420_confirm.close()
          ),
            (error) => (
              this.msgService420.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
            )
          )
      },
      reject: () => {
        this.import420_confirm.close();
      }
    })
  }

  onRowClick(imp: import127_doc) {
    this.newItemEvent.emit({ params: { selector: 'app-import127-detail', nomer: 'Импорт 1-27 №' + imp.nom, id: imp.id } })
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
      data: { type_import: '1_27' }
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
