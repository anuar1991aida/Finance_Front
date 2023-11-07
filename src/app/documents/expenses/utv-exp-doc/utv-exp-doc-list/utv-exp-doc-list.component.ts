import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { utv_expenses_doc, utv_expenses_list } from '../interfaces';
import { UtvExpensesService } from '../utv_expenses.service';
import { MainComponent } from 'src/app/main/main.component/main.component'

@Component({
  selector: 'app-utv-exp-doc-list',
  templateUrl: './utv-exp-doc-list.component.html',
  styleUrls: ['./utv-exp-doc-list.component.css']
})
export class UtvExpDocListComponent implements OnInit, OnChanges {

  constructor(
    private utvListService: UtvExpensesService,
    private utvListref: DynamicDialogRef,
    private utvListconfirm: ConfirmationService,
    private utvListdialog: DialogService,
    private utvListmessage: MessageService,
    private MainComponent: MainComponent,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows
    this.roles = this.MainComponent.roles
  }

  @Input() tabcount = 0
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() closeEvent = new EventEmitter<any>()
  @HostListener('window:keydown', ['$event'])

  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'Delete' && this.isAdmin() && (this.tabcount == this.old_tabcount)) {
      this.massDelete(true)
    }
    else if (event.key === 'Delete' && (this.tabcount == this.old_tabcount)) {
      this.massDelete(false)
    }
  }

  utvList$: Observable<utv_expenses_list>
  searchutvList = ''
  first = 0
  rows = 25
  selectedDocs: any
  windowHeight = 0
  windowWeight = 0
  roles: string[] = []
  old_tabcount = 0

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize()
  }

  isAdmin() {
    return this.roles.includes('fulldata')
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

      // this.deleteService(msg, header, msgsuccess, body)
    }
    else {
      this.utvListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Документ не выбран' })
    }
  }

  ngOnInit(): void {
    this.old_tabcount = this.tabcount
    this.fetchUtvList()
    this.updateWindowSize()
  }

  ngOnChanges(): void {
    if (this.tabcount == this.old_tabcount) {
      this.fetchUtvList()
    }
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight;
    this.windowWeight = window.innerHeight;
  }

  closeform() {
    this.closeEvent.emit()
  }

  fetchUtvList() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.utvList$ = this.utvListService.fetch(params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchUtvList()
  }

  onDelete(utv_exp: utv_expenses_doc) {
    let msg = !utv_exp.deleted ? "Пометить " + utv_exp.nom + " на удаление?" : "Снять с " + utv_exp.nom + " пометку на удаление?"
    let header = !utv_exp.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    let msgsuccess = !utv_exp.deleted ? "Документ помечен на удаление" : "С документа снята пометка на удаление"

    this.utvListconfirm.confirm({
      message: msg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.utvListService.deleteUtv(utv_exp.id)
          .subscribe((data) => (
            this.utvListmessage.add({ severity: 'success', summary: 'Успешно', detail: msgsuccess }),
            this.fetchUtvList(),
            this.utvListconfirm.close()
          ),
            (error) => (
              this.utvListmessage.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
            )
          )
      },
      reject: () => {
        this.utvListconfirm.close();
      }
    });
  }

  onRowEdit(utv_exp: utv_expenses_doc) {
    this.newItemEvent.emit({ params: { selector: 'app-utv-exp-doc-detail', nomer: 'Утвержденный план по расходам ' + utv_exp.nom, id: utv_exp.id } });
  }

  NewDoc() {
    this.newItemEvent.emit({ params: { selector: 'app-utv-exp-doc-detail', nomer: 'Утвержденный план по расходам ', id: 0 } });
  }

  setClass(deleted: boolean) {
    let classs = ''

    if (deleted) {
      classs = 'class-deleted'
    }

    return classs

  }

}
