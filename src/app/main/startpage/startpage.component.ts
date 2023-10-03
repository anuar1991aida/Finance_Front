import { Component, EventEmitter, Output, Input, ViewChild } from "@angular/core";
import { MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { UserDetailComponent } from "src/app/directory/user/user-detail/user-detail.component";

@Component({
  selector: 'startpage-element',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.css']
})


export class StartPageComponent {
  constructor(
    public StartmessageService: MessageService,
    private Startdialog_form: DialogService,
    private start_ref: DynamicDialogRef) { }

  @Output() newItemEvent = new EventEmitter<any>();
  @Output() closeEvent = new EventEmitter<any>();
  @Input() params_doc_book: any;


  ngOnInit() {
  }

  UserHistory() {
    this.start_ref = this.Startdialog_form.open(UserDetailComponent,
      {
        header: 'История входа пользователя',
        width: 'calc(40%)',
        height: 'calc(30%)',
        closable: true
      });

    this.start_ref.onClose.subscribe((save: boolean) => {
      if (save) {
        // this.user_massage.add({ severity: 'success', summary: 'Успешно', detail: 'Пароль изменен! Войдите, пожалуйста, в систему!' }),
        //   this.router.navigate(['login'])
      }
    })
  }

}
