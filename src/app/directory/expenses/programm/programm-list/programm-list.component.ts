import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { programmService } from '../programm.services';
import { programm_detail, programm_list } from '../interfaces';

@Component({
  selector: 'app-programm-list',
  templateUrl: './programm-list.component.html',
  styleUrls: ['./programm-list.component.css']
})
export class ProgrammListComponent implements OnInit {

  constructor(
    private programmListService: programmService,
    private programmListref: DynamicDialogRef,
    private programmListconfirm: ConfirmationService,
    private programmListdialog: DialogService,
    private programmListmessage: MessageService,
  ) { }

  @Input() data = false
  Prog$: Observable<programm_list>
  searchfuncPr = ''
  first = 0
  rows = 3

  ngOnInit(): void {
    this.fetchPr()
  }

  fetchPr() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.Prog$ = this.programmListService.fetch(params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchPr()
  }

  onRowClick(programm_detail: programm_detail) {

  }

  search() {

  }

}
