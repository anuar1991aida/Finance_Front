import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MainComponent } from 'src/app/main/main.component/main.component'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { pogashenie_fkr_list } from '../pogashenie-fkr.interfaces';
import { Observable } from 'rxjs';
import { PogasheniefkrService } from '../pogashenie-fkr.services';

@Component({
  selector: 'app-pogashenie-fkr-list',
  templateUrl: './pogashenie-fkr-list.component.html',
  styleUrls: ['./pogashenie-fkr-list.component.css']
})
export class PogashenieFKRListComponent implements OnInit {

  constructor(
    private pogfkrListref: DynamicDialogRef,
    private pogfkrListconfirm: ConfirmationService,
    private pogfkrListdialog: DialogService,
    private pogfkrListmessage: MessageService,
    private PogfkrService: PogasheniefkrService,
    private MainComponent: MainComponent,
  ) {
    this.first = this.MainComponent.first
    this.rows = this.MainComponent.rows
    this.roles = this.MainComponent.roles
  }

  @Output() newItemEvent = new EventEmitter<any>()
  @Output() closeEvent = new EventEmitter<any>()
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateWindowSize()
  }

  roles: string[] = []
  pog_fkr$: Observable<pogashenie_fkr_list>
  first = 0
  rows = 25
  searchfkr = ''
  windowHeight = 0
  windowWidth = 0
  selectedDocs: any

  ngOnInit(): void {
    this.fetch_pog_fkr(),
      this.updateWindowSize()
  }

  fetch_pog_fkr() {

    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString(),
      search: this.searchfkr,
    }

    this.pog_fkr$ = this.PogfkrService.fetch(params)

  }

  private updateWindowSize() {
    this.windowHeight = window.innerHeight
    this.windowWidth = window.innerWidth
  }

  setClass(deleted: boolean) {
    let classs = ''

    if (deleted) {
      classs = 'class-deleted'
    }

    return classs

  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetch_pog_fkr()
  }

  closeform() {
    this.closeEvent.emit()
  }
}
