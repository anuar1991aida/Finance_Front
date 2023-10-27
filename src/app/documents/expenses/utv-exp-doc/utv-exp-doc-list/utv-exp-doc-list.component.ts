import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { utv_expenses_doc, utv_expenses_list } from '../interfaces';
import { UtvExpensesService } from '../utv_expenses.service';

@Component({
  selector: 'app-utv-exp-doc-list',
  templateUrl: './utv-exp-doc-list.component.html',
  styleUrls: ['./utv-exp-doc-list.component.css']
})
export class UtvExpDocListComponent implements OnInit {

  constructor(
    private utvListService: UtvExpensesService,
    private utvListref: DynamicDialogRef,
    private utvListconfirm: ConfirmationService,
    private utvListdialog: DialogService,
    private utvListmessage: MessageService,
  ) { }

  @Output() newItemEvent = new EventEmitter<any>();
  @Output() closeEvent = new EventEmitter<any>()

  utvList$: Observable<utv_expenses_list>
  searchutvList = ''
  first = 0
  rows = 25
  windowHeight: number

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize()
  }

  ngOnInit(): void {
    this.fetchUtvList(),
      this.updateWindowSize()
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight;
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
