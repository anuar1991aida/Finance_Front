import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';

interface People {
  firstname?: string;
  lastname?: string;
  age?: string;
}

@Component({
  selector: 'child-list',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {

  cols: any[];

  constructor() { }

  ngOnInit() { }
}
