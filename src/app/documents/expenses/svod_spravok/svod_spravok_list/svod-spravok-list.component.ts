import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { svod_expenses_doc, svod_expenses_list } from '../interfaces';
import { MainComponent } from 'src/app/main/main.component/main.component'
import { svodExpensesService } from '../svod_expenses.service';

@Component({
  selector: 'app-svod-spravok-list',
  templateUrl: './svod-spravok-list.component.html',
  styleUrls: ['./svod-spravok-list.component.css']
})
export class SvodSpravokListComponent implements OnInit, OnChanges {

  constructor(
    private MainComponent: MainComponent,
    private svodListService: svodExpensesService,
    private svodListref: DynamicDialogRef,
    private svodListconfirm: ConfirmationService,
    private svodListdialog: DialogService,
    private svodListmessage: MessageService,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows
    this.roles = this.MainComponent.roles
  }

  @Input() tabcount = 0;
  @Output() newItemEvent = new EventEmitter<any>()
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

  menuItems: MenuItem[]
  svodList$: Observable<svod_expenses_list>
  searchutvList = ''
  periods: any
  first = 0
  rows = 25
  roles: string[] = []
  windowHeight: number
  selectedDocs!: any
  old_tabcount = 0

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize()
  }

  isAdmin() {
    return this.roles.includes('fulldata')
  }

  ngOnInit(): void {
    this.old_tabcount = this.tabcount
    this.fetchSvodList()
    this.updateWindowSize()
  }

  ngOnChanges(): void {
    if (this.tabcount == this.old_tabcount) {
      this.fetchSvodList()
    }
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight;
  }

  closeform() {
    this.closeEvent.emit()
  }

  fetchSvodList() {
    if (this.periods!=null) {
      if (this.periods[0]!=null && this.periods[1]!=null) {
        let date_start = this.periods[0].toLocaleDateString()
        let date_stop = this.periods[1].toLocaleDateString()
        let params = {
          limit: this.rows.toString(),
          offset: this.first.toString(),
          search: this.searchutvList,
          date_start: date_start,
          date_stop: date_stop
        }
    
        this.svodList$ = this.svodListService.fetch(params)

      }
    } else {
      let params = {
        limit: this.rows.toString(),
        offset: this.first.toString(),
        search: this.searchutvList,
        date_start: '01.01.2000',
        date_stop: '01.01.2050'
      }
      this.svodList$ = this.svodListService.fetch(params)
    }
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchSvodList()
  }

  buildMenuItems(svodList: any): void {
    this.menuItems = [];

    // Кнопка редактирования всегда присутствует
    this.menuItems.push({
      label: '<span class="text-xl font-bold">Редактировать</span>',
      escape: false,
      icon: 'pi pi-pencil',
      command: () => this.onRowEdit(svodList),
    });

    // Кнопка "Вернуть из рассмотрения" отображается только при условии
    if (svodList.status === 'send') {
      this.menuItems.push({
        label: '<span class="text-xl font-bold">Вернуть с рассмотрения</span>',
        escape: false,
        icon: 'pi pi-times',
        command: () => this.onSendDoc(svodList, 'new'),
      });
    }

    // Кнопка "Отправить на рассмотрение" отображается только при условии
    if (svodList.status === 'new') {
      this.menuItems.push({
        label: '<span class="text-xl font-bold">Отправить на рассмотрение</span>',
        escape: false,
        icon: 'pi pi-upload',
        command: () => this.onSendDoc(svodList, 'send'),
      });
    }

    // Кнопка удаления всегда присутствует
    this.menuItems.push({
      label: '<span class="text-xl font-bold">Удалить</span>',
      escape: false,
      icon: 'pi pi-trash',
      command: () => this.onDelete(svodList),
    });
  }

  onSendDoc(izm: svod_expenses_doc, status: string) {

    let body = {
      doc_id: izm.id,
      status: status
    }
    this.svodListconfirm.confirm({
      message: 'Отправить документ ' + izm.nom + ' на рассмотрение?',
      header: 'Отрпавка на рассмотрение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.svodListService
          .sendSvod(body)
          .subscribe(
            (data) => {
              this.svodListmessage.add
                (
                  {
                    severity: 'success',
                    summary: 'Успешно',
                    detail: 'Документ успешно отправлен'
                  }
                )
              this.fetchSvodList()
              this.svodListconfirm.close()
            },
            (error) => (
              this.svodListmessage.add
                (
                  {
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: error.error.status
                  }
                )
            )
          )
      },
      reject: () => {
        this.svodListconfirm.close()
      }
    })
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
      this.svodListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Документ не выбран' })
    }
  }


  onDelete(svod_exp: svod_expenses_doc) {
    let msg = !svod_exp.deleted ? "Пометить " + svod_exp.nom + " на удаление?" : "Снять с " + svod_exp.nom + " пометку на удаление?"
    let header = !svod_exp.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    let msgsuccess = !svod_exp.deleted ? "Документ помечен на удаление" : "С документа снята пометка на удаление"

    let body = {
      shift: false,
      mass_doc_id: [svod_exp.id]
    }

    this.deleteService(msg, header, msgsuccess, body)
  }

  deleteService(msg: string, header: string, msgsuccess: string, body: any) {
    this.svodListconfirm.confirm({
      message: msg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.svodListService
          .deleteSvod(body)
          .subscribe((data) => (
            this.svodListmessage.add({ severity: 'success', summary: 'Успешно', detail: msgsuccess }),
            this.fetchSvodList(),
            this.svodListconfirm.close()
          ),
            (error) => (
              this.svodListmessage.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
            )
          )
      },
      reject: () => {
        this.svodListconfirm.close();
      }
    })
  }

  onRowEdit(svod_exp: svod_expenses_doc) {
    this.newItemEvent.emit({ params: { selector: 'app-svod-spravok-detail', nomer: 'Свод справок №' + svod_exp.nom, id: svod_exp.id } });
  }

  NewDoc() {
    this.newItemEvent.emit({ params: { selector: 'app-svod-spravok-detail', nomer: 'Свод справок ', id: '' } });
  }

  setClass(deleted: boolean) {
    let classs = ''

    if (deleted) {
      classs = 'class-deleted'
    }

    return classs

  }

}
