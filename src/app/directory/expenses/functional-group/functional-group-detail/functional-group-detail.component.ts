import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {func_group_detail,func_group_list} from '../interfaces';
import { MessageService } from 'primeng/api';
import { catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {FuncGroupService} from '../func-group.services';
@Component({
  selector: 'app-functional-group-detail',
  templateUrl: './functional-group-detail.component.html',
  styleUrls: ['./functional-group-detail.component.css']
})
export class FunctionalGroupDetailComponent implements OnInit {

  constructor(
    private FuncGroupService: FuncGroupService,
    private FuncGroup_Detailmsg: MessageService,
    private FuncGroup_Detailref: DynamicDialogRef,
    public FuncGroup_conf: DynamicDialogConfig) { }

  form: FormGroup
  func_detail: func_group_detail
  ngOnInit(): void {
    this.form = new FormGroup({
      code: new FormControl(null, [Validators.required]),
      name_kaz: new FormControl(null, [Validators.required]),
      name_rus: new FormControl(null, [Validators.required])
    })
    console.log(this.FuncGroup_conf.data.func_detail)
    this.func_detail = this.FuncGroup_conf.data.func_detail
  }


  saveFungroup(){
    if (this.func_detail.id > 0) {
      this.FuncGroupService.add(this.func_detail)
        .pipe(
          timeout(5000), // установка таймаута на 5 секунд
          catchError(error => {
            if (error.name === 'TimeoutError') {
              this.FuncGroup_Detailmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Время ожидания истекло. Попробуйте позднее!' });
            }
            else {
              this.FuncGroup_Detailmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить данные!' });
            }
            return throwError('Произошла ошибка: ' + error.message);
          })

        )
        .subscribe(
          (data) => (this.FuncGroup_Detailmsg.add({ severity: 'success', summary: 'Успешно', detail: 'Категория успешно добавлена!' }), this.FuncGroup_Detailref.close(true)),
          (error) => (this.FuncGroup_Detailmsg.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status }))
        )
    }

  }

  closeCat(boll: boolean){

  }
}
