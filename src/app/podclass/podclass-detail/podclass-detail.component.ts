import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {podclass_interfaces_detail,podclass_interfaces} from '../podclass_interfaces';


@Component({
  selector: 'app-podclass-detail',
  templateUrl: './podclass-detail.component.html',
  styleUrls: ['./podclass-detail.component.css']
})


export class PodclassDetailComponent implements OnInit {

  constructor( public podclassconf: DynamicDialogConfig) { }
  form: FormGroup
  podclass_detail: podclass_interfaces_detail

  ngOnInit(): void {
    this.form = new FormGroup({
      code: new FormControl(null, [Validators.required]),
      name_kaz: new FormControl(null, [Validators.required]),
      name_rus: new FormControl(null, [Validators.required])
    })

    this.podclass_detail = this.podclassconf.data.podclass

  }




}
