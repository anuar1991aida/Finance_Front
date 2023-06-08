import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { podclassService} from "../podclass_servise";
import { podclass_interfaces} from "../podclass_interfaces";

@Component({
  selector: 'app-podclass-list',
  templateUrl: './podclass-list.component.html',
  styleUrls: ['./podclass-list.component.css']
})
export class PodclassListComponent implements OnInit {

  constructor(private podclassService: podclassService) { }

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

}
