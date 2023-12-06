import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { svod_expenses_doc, svod_expenses_list, svod_select_doc, svod_select_list } from '../interfaces';
import { MainComponent } from 'src/app/main/main.component/main.component'
import { svodExpensesService } from '../svod_expenses.service';

@Component({
  selector: 'app-svod-spravok-select',
  templateUrl: './svod-spravok-select.component.html',
  styleUrls: ['./svod-spravok-select.component.css']
})

export class SvodSelectComponent implements OnInit {

  constructor(
    private MainComponent: MainComponent,
    private svod_select_service: svodExpensesService,
    private svod_select_ref: DynamicDialogRef,
    private svod_select_confirm: ConfirmationService,
    private svod_select_config: DynamicDialogConfig,
    private svod_select_dialog: DialogService,
    private svod_select_msg: MessageService,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows
    this.roles = this.MainComponent.roles
  }

  svod_select$: Observable<svod_select_list>
  searchsvod_sel = ''
  first = 0
  rows = 25
  roles: string[] = []
  selectedDocs!: any
  _organization_id = 0
  _type_izm_doc_id = 0
  _date = ''
  isAdmin() {
    return this.roles.includes('fulldata')
  }

  ngOnInit(): void {
    this._organization_id = this.svod_select_config.data.id_org || 0
    this._type_izm_doc_id = this.svod_select_config.data._type_izm_doc_id || 0
    this._date = this.svod_select_config.data._date || ''

    this.fetchSvodSelect()
  }

  fetchSvodSelect() {
    let params = {
      search: this.searchsvod_sel,
      _organization_id: this._organization_id,
      _type_izm_doc_id: this._type_izm_doc_id,
      _date: this._date
    }

    this.svod_select$ = this.svod_select_service.fetch_select(this.rows.toString(), this.first.toString(), params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchSvodSelect()
  }

  onRowSelect(svod_select: svod_select_doc) {
    this.svod_select_ref.close(svod_select)
  }


  getValue(svod_select: svod_select_doc): string {
    if (svod_select.tipdoc == 'izm') {
      return 'Изменение по расходам ' + svod_select.nom
    }
    else {
      return 'Свод по расходам ' + svod_select.nom
    }
  }

}
