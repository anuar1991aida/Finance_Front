import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { podprogrammService } from '../podprogramm.services';
import { podprogramm_detail, podprogramm_list } from '../interfaces';
import { PodprogrammDetailComponent } from '../podprogramm-detail/podprogramm-detail.component';

@Component({
  selector: 'app-podprogramm-list',
  templateUrl: './podprogramm-list.component.html',
  styleUrls: ['./podprogramm-list.component.css']
})
export class PodprogrammListComponent implements OnInit {

  constructor(
    private podprListService: podprogrammService,
    private podprListref: DynamicDialogRef,
    private podprListconfirm: ConfirmationService,
    private podprListdialog: DialogService,
    private podprListmessage: MessageService,
  ) { }

  @Input() data = false
  podProg$: Observable<podprogramm_list>
  searchfuncPr = ''
  first = 0
  rows = 25

  ngOnInit(): void {
    this.fetchpodPr()
  }

  fetchpodPr() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.podProg$ = this.podprListService.fetch(params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchpodPr()
  }

  onRowClick(podprogramm_detail: podprogramm_detail) {
    this.podprListref = this.podprListdialog.open(PodprogrammDetailComponent,
      {
        header: 'Редактирование подпрограммы',
        width: '60%',
        height: '40%',
        data: { podpr_detail: podprogramm_detail }
      });
  }

  search() {

  }

}
