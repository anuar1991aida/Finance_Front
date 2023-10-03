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
  }

  @Input() List = false
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() closeEvent = new EventEmitter<any>()
  @HostListener('window:resize', ['$event'])

  searchizmList = ''
  izmplatList$: Observable<izm_plateji_doc_list>
  windowHeight = 0

  ngOnInit(): void {
    this.fetchIzmPlatList()
    this.updateWindowSize()
  }

  fetchIzmPlatList() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString(),
      search: this.searchizmList
    }

    this.izmplatList$ = this.izmplatListService.fetch(params)
  }

  onDelete(izm_plateji: izm_plateji_doc) {
    let msg = !izm_plateji.deleted ? "Пометить " + izm_plateji.nom + " на удаление?" : "Снять с " + izm_plateji.nom + " пометку на удаление?"
    let header = !izm_plateji.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    let msgsuccess = !izm_plateji.deleted ? "Документ помечен на удаление" : "С документа снята пометка на удаление"

    this.izmplatListconfirm.confirm({
      message: msg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.izmplatListService.deleteIzmPlatezhi(izm_plateji.id)
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
