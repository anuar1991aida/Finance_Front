import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { podclassService } from "../podclass_servise";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { podclass_interfaces, podclass_interfaces_detail } from "../podclass_interfaces";
import { PodclassDetailComponent } from "../podclass-detail/podclass-detail.component"
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-podclass-list',
  templateUrl: './podclass-list.component.html',
  styleUrls: ['./podclass-list.component.css']
})
export class PodclassListComponent implements OnInit {

  constructor(
    private podclassService: podclassService,
    private podclassryref: DynamicDialogRef,
    private messageServicedelSelect: MessageService,
    private podclasslistdialog: DialogService) { }

  podclass$: Observable<podclass_interfaces>
  NewCat: podclass_interfaces_detail = {
    id: '',
    code: '',
    name_kaz: '',
    name_rus: ''
  }

  @Input() data = false
  searchcategory = ''
  first = 0
  rows = 25
  last = 3
  selected: any
  // items = ["5","10","20","30","50"]
  // selectedItem = 'Количество строк'
  ngOnInit(): void {
    this.fetchCat()
  }



  fetchCat() {
    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.podclass$ = this.podclassService.fetch(params)
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetchCat()
  }

  onSelected(podclass: podclass_interfaces_detail) {
    if (!this.selected) {
      this.messageServicedelSelect.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите подкласс!' })
      return
    }
    this.podclassryref.close(podclass)
  }

  onRowClick(podclass: podclass_interfaces_detail) {
    if (this.data) {
      this.onRowEdit(podclass)
    }
    else {
      this.podclassryref.close(podclass)
    }
  }

  onRowEdit(podclass: podclass_interfaces_detail) {

    this.podclassryref = this.podclasslistdialog.open(PodclassDetailComponent,
      {
        header: 'Редактирование подкласса',
        width: '60%',
        height: '40%',
        data: { podclass: podclass }
      });
  }

  openNew() {

    this.NewCat = {
      id: '',
      code: '',
      name_kaz: '',
      name_rus: ''
    }

    this.podclassryref = this.podclasslistdialog.open(PodclassDetailComponent,
      {
        header: 'Создание подкласса',
        width: '60%',
        height: '40%',
        data: { podclass: this.NewCat }
      })
  }

  search() {

  }


  // onItemSelected(){
  //   let params = {
  //     limit: this.selectedItem,
  //     offset: this.first.toString()
  //   }

  //   this.podclass$ = this.podclassService.fetch(params)
  //   // console.log(this.selectedItem);
  // }
}
