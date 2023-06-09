import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { podclassService} from "../podclass_servise";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { podclass_interfaces , podclass_interfaces_detail} from "../podclass_interfaces";
import { PodclassDetailComponent } from "../podclass-detail/podclass-detail.component"
@Component({
  selector: 'app-podclass-list',
  templateUrl: './podclass-list.component.html',
  styleUrls: ['./podclass-list.component.css']
})
export class PodclassListComponent implements OnInit {

  constructor(
    private podclassService: podclassService,
    private podclassryref: DynamicDialogRef,
    private podclasslistdialog: DialogService) { }

  podclass$: Observable<podclass_interfaces>
  first = 0
  rows = 3
  last = 3

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

  onRowEdit(org: podclass_interfaces_detail) {

    this.podclassryref = this.podclasslistdialog.open(PodclassDetailComponent,
      {
        header: 'Редактирование категории',
        width: '60%',
        height: '40%',
        data: { podclass: org }
      });
  }


}
