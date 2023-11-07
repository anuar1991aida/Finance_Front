import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { profileuser } from 'src/app/login/interfaces';
import { MainComponent } from 'src/app/main/main.component/main.component'
import { utv_income_doc, utv_income_list } from '../interfaces';
import { UtvIncomeService } from '../utv_income.service';

@Component({
  selector: 'app-utv-income-list',
  templateUrl: './utv-income-list.component.html',
  styleUrls: ['./utv-income-list.component.css']
})
export class UtvIncomeListComponent implements OnInit, OnChanges {

  first = 0
  rows = 25

  constructor(
    private utvListService: UtvIncomeService,
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

  profileuser: profileuser
  utvList$: Observable<utv_income_list>
  searchutvList = ''
  windowHeight = 0
  windowWidht = 0
  selectedDocs!: any
  roles: string[] = []
  old_tabcount = 0

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize()
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

      this.deleteService(msg, header, msgsuccess, body)
    }
    else {
      this.utvListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Документ не выбран' })
    }
  }


  onDelete(utv_inc: utv_income_doc) {

    if (this.selectedDocs && this.selectedDocs.length !== 1) {
      this.utvListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите только один документ!' })
      return
    }

    let msg = !utv_inc.deleted ? "Пометить " + utv_inc.nom + " на удаление?" : "Снять с " + utv_inc.nom + " пометку на удаление?"
    let header = !utv_inc.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    let msgsuccess = !utv_inc.deleted ? "Документ помечен на удаление" : "С документа снята пометка на удаление"

    let body = {
      shift: false,
      mass_doc_id: [utv_inc.id]
    }

    this.deleteService(msg, header, msgsuccess, body)
  }

  deleteService(msg: string, header: string, msgsuccess: string, body: any) {

    this.utvListconfirm.confirm({
      message: msg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.utvListService
          .deleteUtv(body)
          .subscribe((data) => (
            this.utvListmessage.add({ severity: 'success', summary: 'Успешно', detail: msgsuccess }),
            this.fetchUtvList(),
            this.utvListconfirm.close()
          ),
            (error) => (
              this.utvListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось выполнить операцию!' })
            )
          )
      },
      reject: () => {
        this.utvListconfirm.close();
      }
    });
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight
    this.windowWidht = window.innerWidth
  }

  closeform() {
    this.closeEvent.emit()
  }

  fetchUtvList() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString(),
      search: this.searchutvList
    }

    this.utvList$ = this.utvListService.fetch(params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchUtvList()
  }

  onRowEdit(utv_inc: utv_income_doc) {
    this.newItemEvent.emit({ params: { selector: 'app-utv-income-detail', nomer: 'Утвержденный план по поступлениям ' + utv_inc.nom, id: utv_inc.id } });
  }

  NewDoc() {
    this.newItemEvent.emit({ params: { selector: 'app-utv-income-detail', nomer: 'Утвержденный план по поступлениям ', id: '' } });
  }

  setClass(deleted: boolean) {
    let classs = ''

    if (deleted) {
      classs = 'class-deleted'
    }

    return classs

  }

}
