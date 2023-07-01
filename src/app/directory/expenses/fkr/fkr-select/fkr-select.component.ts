import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { fkrService } from '../fkr.services';
import { fkr_detail, fkr_select } from '../interfaces';

@Component({
  selector: 'app-fkr-select',
  templateUrl: './fkr-select.component.html',
  styleUrls: ['./fkr-select.component.css']
})
export class FkrSelectComponent implements OnInit {

  constructor(
    private fkrSelectService: fkrService,
    private fkrSelectref: DynamicDialogRef,
    private fkrSelectconfirm: ConfirmationService,
    private fkrSelectdialog: DialogService,
    private fkrSelectmessage: MessageService,
  ) { }
  @Output() closeEvent = new EventEmitter<any>()
  @Input() data = false
  fkr$: Observable<fkr_select>
  searchfkr = ''
  first = 0
  rows = 25

  ngOnInit(): void {
    this.fetchPr()
  }

  fetchPr() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString(),
      search: this.searchfkr.toString()
    }

    this.fkr$ = this.fkrSelectService.fetch(params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchPr()
  }

  onRowClick(fkr_detail: fkr_detail) {

  }

  closeform() {
    this.closeEvent.emit()
  }

  search() {

  }

}
