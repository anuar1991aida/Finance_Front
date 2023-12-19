import { Component, EventEmitter, Injectable, Input, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { provideRouter, provideRoutes } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MainComponent } from 'src/app/main/main.component/main.component';
import { profileuser } from "../../login/interfaces";
import { report_16_18_Service } from "./report_16_18.service";
import { reportComponent } from '../report';
import { organization_detail } from "src/app/directory/organization/interfaces";
import { OrganizationDetailComponent } from "src/app/directory/organization/organization-detail/organization-detail.component";
import { OrganizationSelectComponent } from "src/app/directory/organization/organization-select/organization-select.component";
import { BudjetSelectComponent } from "src/app/directory/income/budjet/budjet-select/budjet-select.component";
import { Budjet_detail } from "src/app/directory/income/budjet/interfaces";

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'report_16_18',
    templateUrl: './report_16_18.html'
})

export class report_16_18_Component {
    constructor(
        private MainComponent: MainComponent,
        private reportComponent: reportComponent,
        private Report_16_18_config: DynamicDialogConfig,
        private Report_16_18_Service: report_16_18_Service,
        private sanitizer: DomSanitizer,
        private Report_16_18_msg: MessageService,
        private Report_16_18_ref: DynamicDialogRef,
        private Report_16_18_dialog: DialogService,
        private Report_16_18_confirm: ConfirmationService
    ) {
        this.profileuser = this.MainComponent.profileuser
        this._budjet = {
            id: parseInt(this.profileuser.budjet_id),
            name: this.profileuser.budjet_name
        }
    }

    @Input() type_report_input = ''
    @Output() closeEvent = new EventEmitter<any>()

    url: any = ''
    _date: Date = new Date;
    profileuser: profileuser
    language = 'kaz'
    name = ''
    type_report = ''
    prilozhenieValue = 'pay'
    prilozhenieType = [
        { label: 'Приложение 16', value: 'pay' },
        { label: 'Приложение 18', value: 'obl' }
    ]
    _budjet = {
        'id': 0,
        'name': ''
    }
    langOptions = [
        { label: 'Қазақша', value: 'kaz' },
        { label: 'Русский', value: 'rus' }
    ]

    ngOnInit() {

    }

    changePrilozhenie() {
        this.url = ''
    }

    selectBudjet() {
        this.Report_16_18_ref = this.Report_16_18_dialog.open(BudjetSelectComponent,
            {
                header: 'Выбор бюджета',
                width: '60%',
                height: '80%'
            })

        this.Report_16_18_ref.onClose.subscribe((budjet_detail: Budjet_detail) => {
            if (budjet_detail) {
                this._budjet.id = budjet_detail.id,
                    this._budjet.name = budjet_detail.name_rus
            }
        })
    }

    form() {
        // console.log(this.type_report);

        // if (this._organization.id == 0) {
        //     this.Report_219_msg.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите организацию' })
        //     return
        // }

        let params = {
            _budjet_id: this._budjet.id,
            _date: this._date.toLocaleDateString() + ' ' + this._date.toLocaleTimeString(),
            lang: this.language,
            tip_rep: this.prilozhenieValue
        }

        this.Report_16_18_Service
            .getReport16_18(params)
            .subscribe
            (data => {
                let blob: Blob = new Blob([data], { type: 'application/pdf' });
                let url = window.URL.createObjectURL(blob);
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            })
    }

    closeform() {
        this.closeEvent.emit()
    }

}
