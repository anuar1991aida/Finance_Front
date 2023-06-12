import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { utv_income_doc, utv_income_list } from '../interfaces';
import { UtvIncomeDetailComponent } from '../utv-income-detail/utv-income-detail.component';
import { UtvIncomeService } from '../utv_income.service';

@Component({
  selector: 'app-utv-income-list',
  templateUrl: './utv-income-list.component.html',
  styleUrls: ['./utv-income-list.component.css']
})
export class UtvIncomeListComponent implements OnInit {

  constructor(
    private utvListService: UtvIncomeService,
    private utvListref: DynamicDialogRef,
    private utvListconfirm: ConfirmationService,
    private utvListdialog: DialogService,
    private utvListmessage: MessageService,
  ) { }

  utvList$: Observable<utv_income_list>
  searchutvList = ''
  first = 0
  rows = 3

  ngOnInit(): void {
    this.fetchUtvList()
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

  onDelete(utv_inc: utv_income_doc) {
    this.utvListconfirm.confirm({
      message: 'Вы действительно хотите удалить ' + utv_inc.nom + '?',
      header: 'Удаление документа',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.utvListService.deleteUtv(utv_inc.id)
          .subscribe((data) => (
            this.utvListmessage.add({ severity: 'success', summary: 'Успешно', detail: 'Документ удален!' }),
            this.fetchUtvList(), this.utvListconfirm.close()),
            (error) => (this.utvListmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить документ!' }))
          )
      },
      reject: () => {
        this.utvListconfirm.close();
      }
    });
  }

  search() {

  }

  onRowEdit(utv_inc_id: string) {
    let headertext = 'Редактирование классификации'

    if (utv_inc_id !== '') {
      headertext = 'Создание документа'
    }

    this.utvListref = this.utvListdialog.open(UtvIncomeDetailComponent,
      {
        header: headertext,
        width: '60%',
        height: '40%',
        data: { classif_id: utv_inc_id }
      })

    this.utvListref.onClose.subscribe((save: boolean) => {
      if (save) {
        this.fetchUtvList()
      }
    })
  }

}
