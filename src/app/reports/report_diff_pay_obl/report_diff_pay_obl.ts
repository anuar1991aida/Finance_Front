import { Component, EventEmitter, Injectable, Input, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { provideRouter, provideRoutes } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MainComponent } from 'src/app/main/main.component/main.component';
import { profileuser } from "../../login/interfaces";
import { report_diff_pay_obl_Service } from "./report_diff_pay_obl.service";
import { reportComponent } from '../report';
import { organization_detail } from "src/app/directory/organization/interfaces";
import { OrganizationDetailComponent } from "src/app/directory/organization/organization-detail/organization-detail.component";
import { OrganizationSelectComponent } from "src/app/directory/organization/organization-select/organization-select.component";

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'report_diff_pay_obl',
    templateUrl: './report_diff_pay_obl.html'
})

export class report_pay_obl_Component {
    constructor(
        private MainComponent: MainComponent,
        private reportComponent: reportComponent,
        private Report_pay_obl_config: DynamicDialogConfig,
        private Report_pay_obl_Service: report_diff_pay_obl_Service,
        private sanitizer: DomSanitizer,
        private Report_pay_obl_msg: MessageService,
        private Report_pay_obl_ref: DynamicDialogRef,
        private Report_pay_obl_dialog: DialogService,
        private Report_pay_obl_confirm: ConfirmationService
    ) {
        this.profileuser = this.MainComponent.profileuser
        this._organization = {
            id: parseInt(this.profileuser.org_id),
            name: this.profileuser.org_name
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
    _organization = {
        'id': 0,
        'name': ''
    }
    langOptions = [
        { label: 'Қазақша', value: 'kaz' },
        { label: 'Русский', value: 'rus' }
    ]

    ngOnInit() {


    }

    viewOrg() {
        this.Report_pay_obl_ref = this.Report_pay_obl_dialog.open(OrganizationDetailComponent,
            {
                header: 'Редактирование организации',
                width: '60%',
                height: '80%',
                data: { org_id: this._organization.id }
            })

        this.Report_pay_obl_ref.onClose.subscribe((org: organization_detail) => {
            if (org) {
                this._organization.name = org.name_rus
            }
        })
    }

    selectOrg() {
        this.Report_pay_obl_ref = this.Report_pay_obl_dialog.open(OrganizationSelectComponent,
            {
                header: 'Выбор организации',
                width: '60%',
                height: '80%'
            })

        this.Report_pay_obl_ref.onClose.subscribe((org: organization_detail) => {
            if (org) {
                this._organization.id = org.id,
                    this._organization.name = org.name_rus
            }
        })
    }

    form() {
        // console.log(this.type_report);

        if (this._organization.id == 0) {
            this.Report_pay_obl_msg.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите организацию' })
            return
        }

        let params = {
            _organization_id: this._organization.id,
            _date: this._date.toLocaleDateString() + ' ' + this._date.toLocaleTimeString(),
            lang: this.language
        }

        this.Report_pay_obl_Service
            .getReport_diff_pay_obl(params)
            .subscribe
            (data => {
                let blob: Blob = new Blob([data], { type: 'application/pdf' });
                let url = window.URL.createObjectURL(blob);
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            })
    }

    changePrilozhenie() {
        this.url = ''
    }

    closeform() {
        this.closeEvent.emit()
    }

}
