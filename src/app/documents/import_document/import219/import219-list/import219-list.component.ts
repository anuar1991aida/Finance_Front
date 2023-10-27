import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MainComponent } from 'src/app/main/main.component/main.component';
import { profileuser } from 'src/app/login/interfaces';
import { import219Servise } from '../import219.servise';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { import219_list, import219_doc } from '../interfaces';
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
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'Delete') {
      this.massDelete(true)
    }
    else if (event.key === 'Delete') {
      this.massDelete(false)
    }
  }

  imports$: Observable<import219_list>
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

    this.imports$ = this.import219_service.fetch(params)

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
      this.import219_messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Документ не выбран' })
    }
  }

  onDelete(import_219: import219_doc) {

    if (this.selectedDocs && this.selectedDocs.length !== 1) {
      this.import219_messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите только один документ!' })
      return
    }

    let msg = !import_219.deleted ? "Пометить " + import_219.nom + " на удаление?" : "Снять с " + import_219.nom + " пометку на удаление?"
    let header = !import_219.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    let msgsuccess = !import_219.deleted ? "Документ помечен на удаление" : "С документа снята пометка на удаление"

    let body = {
      shift: false,
      mass_doc_id: [import_219.id]
    }

    this.deleteService(msg, header, msgsuccess, body)
  }

  deleteService(msg: string, header: string, msgsuccess: string, body: any) {
    this.import219_confirm.confirm({
      message: msg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.import219_service
          .delete_import219(body)
          .subscribe((data) => (
            this.import219_messageService.add({ severity: 'success', summary: 'Успешно', detail: msgsuccess }),
            this.fetchImport(),
            this.import219_confirm.close()
          ),
            (error) => (
              this.import219_messageService.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
            )
          )
      },
      reject: () => {
        this.import219_confirm.close();
      }
    })
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
