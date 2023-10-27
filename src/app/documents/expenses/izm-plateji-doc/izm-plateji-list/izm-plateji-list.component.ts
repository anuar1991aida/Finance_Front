import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { MainComponent } from 'src/app/main/main.component/main.component'
import { izm_plateji_doc_list, izm_plateji_doc } from '../interfaces';
import { IzmPlatezhiService } from '../izm-plateji.services';

@Component({
  selector: 'app-izm-plateji-list',
  templateUrl: './izm-plateji-list.component.html',
  styleUrls: ['./izm-plateji-list.component.css']
})
export class IzmPlatejiListComponent implements OnInit {

  first = 0
  rows = 25

  constructor(
    private MainComponent: MainComponent,
    private izmplatListService: IzmPlatezhiService,
    private izmplatListconfirm: ConfirmationService,
    private izmplatListmessage: MessageService,
    private izmplatListref: DynamicDialogRef,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows
    this.roles = this.MainComponent.roles
  }

  @Input() List = false
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() closeEvent = new EventEmitter<any>()
  @HostListener('window:resize', ['$event'])
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'Delete' && this.isAdmin()) {
      this.massDelete(true)
    }
    else if (event.key === 'Delete') {
      this.massDelete(false)
    }
  }

  roles: string[] = []
  searchizmList = ''
  izmplatList$: Observable<izm_plateji_doc_list>
  windowHeight = 0
  selectedDocs: any

  ngOnInit(): void {
    this.fetchIzmPlatList()
    this.updateWindowSize()
  }

  isAdmin() {
    return this.roles.includes('fulldata')
  }

  fetchIzmPlatList() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString(),
      search: this.searchizmList
    }

    this.izmplatList$ = this.izmplatListService.fetch(params)
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
      this.izmplatListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Документ не выбран' })
    }
  }


  onDelete(izm_exp: izm_plateji_doc) {

    if (this.selectedDocs && this.selectedDocs.length !== 1) {
      this.izmplatListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите только один документ!' })
      return
    }

    let msg = !izm_exp.deleted ? "Пометить " + izm_exp.nom + " на удаление?" : "Снять с " + izm_exp.nom + " пометку на удаление?"
    let header = !izm_exp.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    let msgsuccess = !izm_exp.deleted ? "Документ помечен на удаление" : "С документа снята пометка на удаление"

    let body = {
      shift: false,
      mass_doc_id: [izm_exp.id]
    }

    this.deleteService(msg, header, msgsuccess, body)
  }

  deleteService(msg: string, header: string, msgsuccess: string, body: any) {

    this.izmplatListconfirm.confirm({
      message: msg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.izmplatListService.
          deleteIzmPlatezhi(body)
          .subscribe((data) => (
            this.izmplatListmessage.add({ severity: 'success', summary: 'Успешно', detail: msgsuccess }),
            this.fetchIzmPlatList(),
            this.izmplatListconfirm.close()
          ),
            (error) => (
              this.izmplatListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось выполнить операцию!' })
            )
          )
      },
      reject: () => {
        this.izmplatListconfirm.close();
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

  onRowSelect(izm_plateji: izm_plateji_doc) {
    if (this.List) {
      this.onRowEdit(izm_plateji)
    }
    else {
      this.izmplatListref.close(izm_plateji)
    }
  }

  onRowEdit(izm_plateji: izm_plateji_doc) {
    this.newItemEvent.emit({ params: { selector: 'app-izm-plateji-detail', nomer: 'Изменения плана по расходам ' + izm_plateji.nom, id: izm_plateji.id } });
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchIzmPlatList()
  }

  NewDoc() {
    this.newItemEvent.emit({ params: { selector: 'app-izm-plateji-detail', nomer: 'Изменения плана по расходам ', id: '' } });
  }

  onResize(event: Event) {
    this.updateWindowSize()
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight;
  }

  closeform() {
    this.closeEvent.emit()
  }

}
