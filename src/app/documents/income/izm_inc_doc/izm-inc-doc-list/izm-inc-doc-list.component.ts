import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { MainComponent } from 'src/app/main/main.component/main.component'
import { izm_inc_doc, izm_inc_doc_list } from '../interfaces';
import { IzmIncomeService } from '../izm_income.service';

@Component({
  selector: 'app-izm-inc-doc-list',
  templateUrl: './izm-inc-doc-list.component.html',
  styleUrls: ['./izm-inc-doc-list.component.css']
})
export class IzmIncDocListComponent implements OnInit {

  constructor(
    private IzmListService: IzmIncomeService,
    private IzmListref: DynamicDialogRef,
    private IzmListconfirm: ConfirmationService,
    private IzmListdialog: DialogService,
    private IzmListmessage: MessageService,
    private MainComponent: MainComponent,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows
    this.roles = this.MainComponent.roles
  }

  @Output() newItemEvent = new EventEmitter<any>()
  @Output() closeEvent = new EventEmitter<any>()
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
  doc_izm$: Observable<izm_inc_doc_list>
  first = 0
  rows = 25
  searchIzmInc = ''
  windowHeight: number
  selectedDocs: any

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize()
  }

  isAdmin() {
    return this.roles.includes('fulldata')
  }

  ngOnInit(): void {
    this.fetch_doc_izm(),
      this.updateWindowSize()
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight;
  }

  setClass(deleted: boolean) {
    let classs = ''

    if (deleted) {
      classs = 'class-deleted'
    }

    return classs

  }

  fetch_doc_izm() {

    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString(),
      search: this.searchIzmInc,
    }

    this.doc_izm$ = this.IzmListService.fetch(params)

  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetch_doc_izm()
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
      this.IzmListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Документ не выбран' })
    }
  }


  onDelete(izm_inc: izm_inc_doc) {

    if (this.selectedDocs && this.selectedDocs.length !== 1) {
      this.IzmListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите только один документ!' })
      return
    }

    let msg = !izm_inc.deleted ? "Пометить " + izm_inc.nom + " на удаление?" : "Снять с " + izm_inc.nom + " пометку на удаление?"
    let header = !izm_inc.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    let msgsuccess = !izm_inc.deleted ? "Документ помечен на удаление" : "С документа снята пометка на удаление"

    let body = {
      shift: false,
      mass_doc_id: [izm_inc.id]
    }

    this.deleteService(msg, header, msgsuccess, body)
  }

  deleteService(msg: string, header: string, msgsuccess: string, body: any) {

    this.IzmListconfirm.confirm({
      message: msg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.IzmListService
          .deleteIzm(body)
          .subscribe((data) => (
            this.IzmListmessage.add({ severity: 'success', summary: 'Успешно', detail: msgsuccess }),
            this.fetch_doc_izm(),
            this.IzmListconfirm.close()
          ),
            (error) => (
              this.IzmListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось выполнить операцию!' })
            )
          )
      },
      reject: () => {
        this.IzmListconfirm.close();
      }
    });
  }

  onRowEdit(izm_inc: izm_inc_doc) {
    this.newItemEvent.emit({ params: { selector: 'app-izm-inc-doc-detail', nomer: 'Изменения плана финансирования по поступлениям ' + izm_inc.nom, id: izm_inc.id } });
  }

  NewDoc() {
    this.newItemEvent.emit({ params: { selector: 'app-izm-inc-doc-detail', nomer: 'Изменения плана финансирования по поступлениям ', id: '' } });
  }

  search() {

  }

  closeform() {
    this.closeEvent.emit()
  }

}
