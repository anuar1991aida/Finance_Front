import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { user_detail } from '../interfaces';
import { UsersService } from '../user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor(
    private userService: UsersService,
    private userdetref: DynamicDialogRef,
    private userdetmessageService: MessageService,
    private userdetdialogservice: DialogService,
    private userdetconfig: DynamicDialogConfig
  ) { }

  userForm: FormGroup;
  user_detail: user_detail
  user_id = 0
  readonly = true
  changepass = false
  secondpassword = ''


  ngOnInit(): void {

    // this.userForm = new FormGroup({
    //   userFormControl: new FormControl(''),
    //   nameFormControl: new FormControl('', Validators.required),
    //   emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    //   PasswordFormControl: new FormControl('', [Validators.minLength(8)])
    // })

    this.user_id = this.userdetconfig.data.user_id

    if (this.user_id !== 0) {
      this.userService
        .fetchUser(this.user_id)
        .subscribe(
          (data) => (this.user_detail = data),
          (error) => (this.userdetmessageService.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status }))
        )

    }
  }

  change(mainpassword: String) {
    if (mainpassword == '' && this.secondpassword == '') {
      this.changepass = false
    } else {
      this.changepass = mainpassword == this.secondpassword;
    }
  }

  saveUser() {
    this.userService
      .saveUser(this.user_detail)
      .subscribe(
        (data) => (this.userdetref.close),
        (error) => (this.userdetmessageService.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status }))
      )
  }

}
