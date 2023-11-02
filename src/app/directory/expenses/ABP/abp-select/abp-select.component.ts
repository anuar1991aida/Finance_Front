import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { abpService } from '../abp.services';
import { abp_detail, abp_list } from '../interfaces';
import { MainComponent } from 'src/app/main/main.component/main.component'

@Component({
  selector: 'app-abp-select',
  templateUrl: './abp-select.component.html',
  styleUrls: ['./abp-select.component.css']
})
export class ABPSelectComponent implements OnInit {

  constructor(
    private MainComponent: MainComponent,
    private abpSelectService: abpService,
    private abpSelectref: DynamicDialogRef,
    private abpSelectconfirm: ConfirmationService,
    private abpSelectdialog: DialogService,
    private abpSelectmessage: MessageService,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows
  }

  @Output() closeEvent = new EventEmitter<any>()
  @Input() data = false

  abp_select$: Observable<abp_list>
  searchfuncGr = ''
  first = 0
  rows = 25
  selected: any
  windowHeight: number

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize()
  }

  ngOnInit(): void {
    this.fetchABP(),
      this.updateWindowSize()
  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight * 0.8;
  }

  fetchABP() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.abp_select$ = this.abpSelectService.fetch(params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchABP()
  }

  closeform() {
    this.closeEvent.emit()
  }

  onRowClick(abp_detail: abp_detail) {
    this.abpSelectref.close(abp_detail)
  }

  onSelected(abp_detail: abp_detail) {
    if (!this.selected) {
      this.abpSelectmessage.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите АБП!' })
      return
    }
    this.abpSelectref.close(abp_detail)
  }

  search() {

  }



}
