import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { FuncPodgroupService } from '../func-podgroup.services';
import { func_podgroup_detail, func_podgroup_list } from '../interfaces';
import { FunctionalPodgroupDetailComponent } from '../functional-podgroup-detail/functional-podgroup-detail.component';

@Component({
  selector: 'app-functional-podgroup-list',
  templateUrl: './functional-podgroup-list.component.html',
  styleUrls: ['./functional-podgroup-list.component.css']
})
export class FunctionalPodgroupListComponent implements OnInit {

  constructor(
    private funcpodGrService: FuncPodgroupService,
    private funcpodGrref: DynamicDialogRef,
    private funcpodGrconfirm: ConfirmationService,
    private funcpodGrListdialog: DialogService,
    private funcpodGrListmessage: MessageService,
  ) { }

  @Input() data = false
  funcpodGr$: Observable<func_podgroup_list>
  searchfuncpodGr = ''
  first = 0
  rows = 3

  ngOnInit(): void {
    this.fetchGr()
  }

  fetchGr() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.funcpodGr$ = this.funcpodGrService.fetch(params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchGr()
  }

  onRowClick(func_detail: func_podgroup_detail) {
    this.funcpodGrref = this.funcpodGrListdialog.open(FunctionalPodgroupDetailComponent,
      {
        header: 'Редактирование функциональной подгруппы',
        width: '60%',
        height: '40%',
        data: { func_detail: func_detail }
      });
  }

  search() {

  }

}
