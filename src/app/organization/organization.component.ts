import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { listOrg } from '../interfaces';
import { OrganizationsService } from '../services/organization.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  constructor(private orgService: OrganizationsService) { }

  organizations$: Observable<listOrg>
  first = 0
  rows = 1

  ngOnInit() {
    this.organizations$ = this.orgService.fetch()
  }

  onPageChange(event: any) {
    console.log(event);

    this.first = event.first;
    this.rows = event.rows;
  }

}
