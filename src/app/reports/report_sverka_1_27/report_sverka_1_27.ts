import { Component, EventEmitter, Injectable, Input, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { provideRouter, provideRoutes } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MainComponent } from 'src/app/main/main.component/main.component';
import { profileuser } from "../../login/interfaces";
import { report_sverka_127_Service } from "./report_sverka_1_27.service";
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
    selector: 'report_sverka_1_27',
    templateUrl: './report_sverka_1_27.html'
})

export class report_sverka_1_27_Component {
    constructor(
        private MainComponent: MainComponent,
        private reportComponent: reportComponent,
        private Report_16_18_config: DynamicDialogConfig,
        private Report_sverka_2_27: report_sverka_127_Service,
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
    _loading:boolean = false
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
        this._loading = true
        this.url = ''
        let params = {
            _budjet_id: this._budjet.id,
            _date: this._date.toLocaleDateString() + ' ' + this._date.toLocaleTimeString(),
            lang: this.language,
            tip_rep: this.prilozhenieValue
        }

        this.Report_sverka_2_27
            .getReport(params)
            .subscribe
            (data => {
                this._loading = false
                let blob: Blob = new Blob([data], { type: 'application/pdf' });
                let url = window.URL.createObjectURL(blob);
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            },
            error => {
                this._loading = false
            })
    }

    closeform() {
        this.closeEvent.emit()
    }

}
