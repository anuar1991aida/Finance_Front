import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { izm_inc_doc_tab , izm_inc_doc , izm_inc_doc_detail ,izm_inc_doc_list} from '../interfaces';
import { Doc_izm_Servis } from '../izm_servise';

@Component({
  selector: 'app-izm-inc-doc-list',
  templateUrl: './izm-inc-doc-list.component.html',
  styleUrls: ['./izm-inc-doc-list.component.css']
})
export class IzmIncDocListComponent implements OnInit {

  constructor(
    private doc_izm_Servis: Doc_izm_Servis
  ) { }

  doc_izm$: Observable<izm_inc_doc_list>
  first = 0
  rows = 3
  last = 3
  searchcategory = ''


  ngOnInit(): void {
    this.fetch_doc_izm()
  }


  fetch_doc_izm() {

    let params = {
      limit: this.rows.toString(),
      offset: this.first.toString()
    }

    this.doc_izm$ = this.doc_izm_Servis.fetch(params)

  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.fetch_doc_izm()
  }

  openNew(){

  }

  search(){

  }

  fetchCat(){

  }

  onRowEdit(org:string){

  }
}
