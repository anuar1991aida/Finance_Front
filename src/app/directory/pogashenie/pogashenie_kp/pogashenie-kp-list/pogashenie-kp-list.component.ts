import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MainComponent } from 'src/app/main/main.component/main.component'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { pogashenie_kp_list } from '../pogashenie-kp.interfaces';
import { Observable } from 'rxjs';
import { PogashenieKPService } from '../pogashenie-kp.services';

@Component({
  selector: 'app-pogashenie-kp-list',
  templateUrl: './pogashenie-kp-list.component.html',
  styleUrls: ['./pogashenie-kp-list.component.css']
})
export class PogashenieKpListComponent implements OnInit {

  constructor(
    private pogKPListref: DynamicDialogRef,
    private pogKPListconfirm: ConfirmationService,
    private pogKPListdialog: DialogService,
    private pogKPListmessage: MessageService,
    private PogKPService: PogashenieKPService,
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
  pog_kp$: Observable<pogashenie_kp_list>
  first = 0
  rows = 25
  searchKP = ''
  windowHeight = 0
  windowWidth = 0
  selectedDocs: any

  ngOnInit(): void {
    this.fetch_pog_kp(),
      this.updateWindowSize()
  }

  fetch_pog_kp() {

    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString(),
      search: this.searchKP,
    }

    this.pog_kp$ = this.PogKPService.fetch(params)

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
    this.fetch_pog_kp()
  }

  closeform() {
    this.closeEvent.emit()
  }
}
