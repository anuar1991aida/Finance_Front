import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { svod_expenses_doc, svod_expenses_list } from '../interfaces';
import { svodExpensesService } from '../svod_expenses.service';

@Component({
  selector: 'app-svod-spravok-list',
  templateUrl: './svod-spravok-list.component.html',
  styleUrls: ['./svod-spravok-list.component.css']
})
export class SvodSpravokListComponent implements OnInit {

  constructor(
    private svodListService: svodExpensesService,
    private svodListref: DynamicDialogRef,
    private svodListconfirm: ConfirmationService,
    private svodListdialog: DialogService,
    private svodListmessage: MessageService,
  ) { }

  @Output() newItemEvent = new EventEmitter<any>()
  @Output() closeEvent = new EventEmitter<any>()

  svodList$: Observable<svod_expenses_list>
  searchutvList = ''
  first = 0
  rows = 25
  windowHeight: number

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize()
  }

  ngOnInit(): void {
    this.fetchSvodList(),
      this.updateWindowSize()
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight;
  }

  closeform() {
    this.closeEvent.emit()
  }

  fetchSvodList() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.svodList$ = this.svodListService.fetch(params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchSvodList()
  }

  onDelete(svod_exp: svod_expenses_doc) {
    // let msg = !svod_exp.deleted ? "Пометить " + svod_exp.nom + " на удаление?" : "Снять с " + svod_exp.nom + " пометку на удаление?"
    // let header = !svod_exp.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    // let msgsuccess = !svod_exp.deleted ? "Документ помечен на удаление" : "С документа снята пометка на удаление"

    // this.svodListconfirm.confirm({
    //   message: msg,
    //   header: header,
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.svodListService.deleteUtv(svod_exp.id)
    //       .subscribe((data) => (
    //         this.svodListmessage.add({ severity: 'success', summary: 'Успешно', detail: msgsuccess }),
    //         this.fetchSvodList(),
    //         this.svodListconfirm.close()
    //       ),
    //         (error) => (
    //           this.svodListmessage.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
    //         )
    //       )
    //   },
    //   reject: () => {
    //     this.svodListconfirm.close();
    //   }
    // });
  }

  onRowEdit(svod_exp: svod_expenses_doc) {
    this.newItemEvent.emit({ params: { selector: 'app-svod-spravok-detail', nomer: 'Свод справок ' + svod_exp.nom, id: svod_exp.id } });
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
