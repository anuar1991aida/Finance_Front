import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';
import { MainComponent } from 'src/app/main/main.component/main.component'
import { izm_plateji_doc_list, izm_plateji_doc } from '../interfaces';
import { IzmPlatezhiService } from '../izm-plateji.services';

@Component({
  selector: 'app-izm-plateji-list',
  templateUrl: './izm-plateji-list.component.html',
  styleUrls: ['./izm-plateji-list.component.css']
})
export class IzmPlatejiListComponent implements OnInit, OnChanges {

  first = 0
  rows = 25

  constructor(
    private MainComponent: MainComponent,
    private izmplatListService: IzmPlatezhiService,
    private izmplatListconfirm: ConfirmationService,
    private izmplatListmessage: MessageService,
    private izmplatListref: DynamicDialogRef,
    public izm_plat_config: DynamicDialogConfig,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows
    this.roles = this.MainComponent.roles
  }

  buildMenuItems(izmList: any): void {
    this.menuItems = [];

    // Кнопка редактирования всегда присутствует
    this.menuItems.push({
      label: '<span class="text-xl font-bold">Редактировать</span>',
      escape: false,
      icon: 'pi pi-pencil',
      command: () => this.onRowEdit(izmList),
    });

    // Кнопка "Вернуть из рассмотрения" отображается только при условии
    if (izmList.status === 'send') {
      this.menuItems.push({
        label: '<span class="text-xl font-bold">Вернуть с рассмотрения</span>',
        escape: false,
        icon: 'pi pi-times',
        command: () => this.onSendDoc(izmList, 'new'),
      });
    }

    // Кнопка "Отправить на рассмотрение" отображается только при условии
    if (izmList.status === 'new') {
      this.menuItems.push({
        label: '<span class="text-xl font-bold">Отправить на рассмотрение</span>',
        escape: false,
        icon: 'pi pi-upload',
        command: () => this.onSendDoc(izmList, 'send'),
      });
    }

    // Кнопка удаления всегда присутствует
    this.menuItems.push({
      label: '<span class="text-xl font-bold">Удалить</span>',
      escape: false,
      icon: 'pi pi-trash',
      command: () => this.onDelete(izmList),
    });
  }

  @Input() List = false
  @Input() tabcount = 0;

  @Output() newItemEvent = new EventEmitter<any>()
  @Output() closeEvent = new EventEmitter<any>()

  @HostListener('window:resize', ['$event'])

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
  roles: string[] = []
  searchizmList = ''
  periods: any
  izmplatList$: Observable<izm_plateji_doc_list>
  windowHeight = 0
  selectedDocs: any
  type = ''
  old_tabcount = 0
  type_str = ''

  ngOnInit(): void {
    this.type = this.izm_plat_config.data?.type || ''
    this.old_tabcount = this.tabcount
    this.fetchIzmPlatList()
    this.updateWindowSize()
  }

  selectPeriod() {
    if (this.periods!=null) {
      if (this.periods[0]!=null && this.periods[1]!=null) {
        let date_start = this.periods[0].toLocaleDateString()
        let date_stop = this.periods[1].toLocaleDateString()
        

        let params = {
          limit: this.rows.toString(),
          offset: this.first.toString(),
          search: this.searchizmList,
          type: this.type,
          date_start: date_start,
          date_stop: date_stop
        }
    
        this.izmplatList$ = this.izmplatListService.fetch(params)

      }
    } else {
      this.fetchIzmPlatList()
    }
  }

  ngOnChanges(): void {
    if (this.tabcount == this.old_tabcount) {
      this.fetchIzmPlatList()
    }
  }

  isAdmin() {
    return this.roles.includes('fulldata')
  }

  fetchIzmPlatList() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString(),
      search: this.searchizmList,
      type: this.type,
      date_start: '01.01.2000',
      date_stop: '01.01.2050'
    }

    this.izmplatList$ = this.izmplatListService.fetch(params)
  }

  getValue(status: string): string {
    if (status == 'new') {
      return 'Новый'
    }
    else if (status == 'send') {
      return 'Отправлен'
    }
    else {
      return 'Отказан'
    }
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

  onSendDoc(izm: izm_plateji_doc, status: string) {

    let body = {
      doc_id: izm.id,
      status: status
    }
    this.izmplatListconfirm.confirm({
      message: 'Отправить документ ' + izm.nom + ' на рассмотрение?',
      header: 'Отрпавка на рассмотрение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.izmplatListService
          .sendIzm(body)
          .subscribe(
            (data) => {
              this.izmplatListmessage.add
                (
                  {
                    severity: 'success',
                    summary: 'Успешно',
                    detail: 'Документ успешно отправлен'
                  }
                )
              this.fetchIzmPlatList()
              this.izmplatListconfirm.close()
            },
            (error) => (
              this.izmplatListmessage.add
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
        this.izmplatListconfirm.close()
      }
    })
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
    this.newItemEvent.emit({ params: { selector: 'app-izm-plateji-detail', nomer: 'Изменения плана по расходам (создание)', id: '' } });
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
