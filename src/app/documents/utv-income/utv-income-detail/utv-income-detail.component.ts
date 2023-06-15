import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClassificationIncomeDetailComponent } from 'src/app/directory/classification-income/classification-income-detail/classification-income-detail.component';
import { ClassificationIncomeListComponent } from 'src/app/directory/classification-income/classification-income-list/classification-income-list.component';
import { utv_income_detail } from '../interfaces';
import { UtvIncomeService } from '../utv_income.service';

@Component({
  selector: 'app-utv-income-detail',
  templateUrl: './utv-income-detail.component.html',
  styleUrls: ['./utv-income-detail.component.css']
})
export class UtvIncomeDetailComponent implements OnInit {

  constructor(
    private utvDetailService: UtvIncomeService,
    private utvDetailmsg: MessageService,
    private utvDetailref: DynamicDialogRef,
    private utvDetaildialog: DialogService,
    private utvDetailconfirm: ConfirmationService,
  ) {
    this.items = [
      {
        label: 'Записать',
        icon: 'pi pi-save',
        command: () => {
          this.saveDoc(false);
        }
      },
      // {
      //   label: 'Пометка на удаление',
      //   icon: 'pi pi-times',
      //   command: () => {
      //     this.onDelete();
      //   }
      // }
    ]
  }

  @Input() utv_inc_id = ''
  @Output() closeEvent = new EventEmitter<any>();

  items: MenuItem[];
  form: FormGroup
  utvDetail: utv_income_detail
  responce: any

  ngOnInit(): void {
    this.form = new FormGroup({
      number_doc: new FormControl(null, [Validators.required]),
      date_doc: new FormControl(null, [Validators.required]),
      org_name: new FormControl(null, [Validators.required]),
      budjet_name: new FormControl(null, [Validators.required])
    })

    if (this.utv_inc_id !== '') {
      this.utvDetailService.fetch_detail(this.utv_inc_id)
        .subscribe(
          (detail) => {
            this.utvDetail = detail
          }
        )
    }
    else {
      this.utvDetail = {
        doc: {
          org_name: '',
          budjet_name: '',
          nom: '',
          _date: '',
          deleted: false,
          _organization: 0,
          _budjet: 0
        },
        tbl1: [{
          id: 0,
          deleted: false,
          god: 0,
          sm1: 0,
          sm2: 0,
          sm3: 0,
          sm4: 0,
          sm5: 0,
          sm6: 0,
          sm7: 0,
          sm8: 0,
          sm9: 0,
          sm10: 0,
          sm11: 0,
          sm12: 0,
          _date: '',
          _organization: 0,
          _utv_inc: 0,
          _classification: 0,
          classification_name: '',
          classification_code: ''
        }]
      }

      this.utvDetail.tbl1.splice(0, this.utvDetail.tbl1.length)
    }
  }

  addClassification() {
    this.utvDetailref = this.utvDetaildialog.open(ClassificationIncomeListComponent,
      {
        header: 'Выбор классификации',
        width: '60%',
        height: '80%'
      })

    this.utvDetailref.onClose.subscribe((classific: any) => {
      if (classific) {
        this.utvDetail.tbl1.push(
          {
            _classification: classific.id,
            classification_name: classific.name_rus,
            classification_code: classific.code,
            id: 0,
            god: 0,
            sm1: 0,
            sm2: 0,
            sm3: 0,
            sm4: 0,
            sm5: 0,
            sm6: 0,
            sm7: 0,
            sm8: 0,
            sm9: 0,
            sm10: 0,
            sm11: 0,
            sm12: 0,
            deleted: false,
            _organization: 0,
            _utv_inc: 0,
            _date: this.utvDetail.doc._date
          })
      }
    })
  }

  editClassification(id: number) {
    this.utvDetailref = this.utvDetaildialog.open(ClassificationIncomeListComponent,
      {
        header: 'Выбор классификации',
        width: '60%',
        height: '80%'
      })

    this.utvDetailref.onClose.subscribe((classific: any) => {
      if (classific) {
        let targetRow = this.utvDetail.tbl1.find((row) => row.id = id)
        if (targetRow) {
          targetRow._classification = classific.id
          targetRow.classification_name = classific.name_rus
          targetRow.classification_code = classific.code
        }
      }
    })
  }

  viewClassification(classif_inc_id: number) {
    this.utvDetailref = this.utvDetaildialog.open(ClassificationIncomeDetailComponent,
      {
        header: 'Редактирование классификации',
        width: '60%',
        height: '40%',
        data: { classif_id: classif_inc_id }
      })

  }

  saveDoc(close: boolean): void {
    let responce: any

    this.utvDetailService.saveUtv(this.utvDetail)
      .subscribe(
        (data) => (
          this.utvDetailmsg.add({ severity: 'success', summary: 'Успешно', detail: 'Документ успешно записан!' }),
          responce = data, this.utvDetail = responce,
          this.closeform(close)
        ),
        (error) => (
          this.utvDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
        )
      )
  }

  onDelete() {
    let msg = !this.utvDetail.doc.deleted ? "Пометить " + this.utvDetail.doc.nom + " на удаление?" : "Снять с " + this.utvDetail.doc.nom + " пометку на удаление?"
    let header = !this.utvDetail.doc.deleted ? "Пометка на удаление" : "Снять с пометки на удаление"
    let msgsuccess = !this.utvDetail.doc.deleted ? "Документ помечен на удаление" : "С документа снята пометка на удаление"

    this.utvDetailconfirm.confirm({
      message: msg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.utvDetailService.deleteUtv(this.utvDetail.doc.id)
          .subscribe((data) => (
            this.utvDetailmsg.add({ severity: 'success', summary: 'Успешно', detail: msgsuccess })
          ),
            (error) => (
              this.utvDetailmsg.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })
            )
          )
      },
      reject: () => {
        this.utvDetailconfirm.close();
      }
    });
  }

  changedate() {
    this.utvDetail.doc._date = this.toLocaleDate(this.utvDetail.doc._date)
  }

  toLocaleDate(dateForStr: string) {
    return new Date(dateForStr).toLocaleDateString();
  }

  closeform(close: boolean) {
    if (close) {
      this.closeEvent.emit()
    }
  }
}
