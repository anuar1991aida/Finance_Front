import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { changePassService } from './callcenter.service'

@Component({
  selector: 'app-callcenter',
  templateUrl: './callcenter.component.html',
  styleUrls: ['./callcenter.component.css']
})
export class CallcenterComponent implements OnInit {

  constructor(
    private changePassService: changePassService,
    private change_pass_msg: MessageService,
    private change_pass_ref: DynamicDialogRef,
    private change_pass__conf: DynamicDialogConfig) {
    this.byToken = this.change_pass__conf.data?.byToken || false
  }

  byToken = false
  temp_token = ''
  newpassword: string = '';
  secondpassword = ''
  changepass: boolean = false;

  form: FormGroup
  ngOnInit(): void {
 
  }



  send() {
    this.change_pass_ref.close()
  }

  closeRef() {
    this.change_pass_ref.close()
  }



}