import { Component, EventEmitter, Injectable, Input, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { provideRouter, provideRoutes } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MainComponent } from 'src/app/main/main.component/main.component';
import { profileuser } from "../../login/interfaces";
import { report_7_9_Service } from "./report_export.service";
import { reportComponent } from '../report';
import { organization_detail } from "src/app/directory/organization/interfaces";
import { OrganizationDetailComponent } from "src/app/directory/organization/organization-detail/organization-detail.component";
import { OrganizationSelectComponent } from "src/app/directory/organization/organization-select/organization-select.component";

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'report_export',
    templateUrl: './report_export.html'
})

export class report_export_Component {
    constructor(
        private MainComponent: MainComponent,
        private reportComponent: reportComponent,
        private report_export_config: DynamicDialogConfig,
        private report_export_Service: report_7_9_Service,
        private sanitizer: DomSanitizer,
        private report_export_msg: MessageService,
        private report_export_ref: DynamicDialogRef,
        private report_export_dialog: DialogService,
        private report_export_confirm: ConfirmationService
    ) {
        this.profileuser = this.MainComponent.profileuser
        this._organization = {
            id: parseInt(this.profileuser.org_id),
            name: this.profileuser.org_name
        }
    }

    @Input() type_report = ''
    @Output() closeEvent = new EventEmitter<any>()

    url: any = ''
    _date: Date = new Date;
    profileuser: profileuser
    language = 'kaz'
    name = ''
    // type_report = ''

    doc = {
        'id': 0,
        'nom': '',
        'name': '',
        'type_doc': ''
    }

    _organization = {
        'id': 0,
        'name': ''
    }

    langOptions = [
        { label: 'Қазақша', value: 'kaz' },
        { label: 'Русский', value: 'rus' }
    ]

    ngOnInit() {
        if (this.type_report !== 'plan') {
            this.type_report = 'doc'
            this.doc = this.report_export_config.data.doc || ''
            console.log(this.doc)
        }
    }

    viewOrg() {
        this.report_export_ref = this.report_export_dialog.open(OrganizationDetailComponent,
            {
                header: 'Редактирование организации',
                width: '60%',
                height: '80%',
                data: { org_id: this._organization.id }
            })

        this.report_export_ref.onClose.subscribe((org: organization_detail) => {
            if (org) {
                this._organization.name = org.name_rus
            }
        })
    }

    selectOrg() {
        this.report_export_ref = this.report_export_dialog.open(OrganizationSelectComponent,
            {
                header: 'Выбор организации',
                width: '60%',
                height: '80%'
            })

        this.report_export_ref.onClose.subscribe((org: organization_detail) => {
            if (org) {
                this._organization.id = org.id,
                    this._organization.name = org.name_rus
            }
        })
    }

    form() {
        if (this._organization.id == 0) {
            this.report_export_msg.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите организацию' })
            return
        }

        let params = {
            _organization_id: this._organization.id,
            _date: this._date.toLocaleDateString() + ' ' + this._date.toLocaleTimeString(),
            tiprep: this.type_report,
            tipdoc: this.doc.type_doc,
            id_doc: this.doc.id,
            lang: this.language,
            format: 'pdf'
        }

        this.report_export_Service
            .getreport_export(params)
            .subscribe
            (data => {
                let blob: Blob = new Blob([data], { type: 'application/pdf' });
                let url = window.URL.createObjectURL(blob);
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            })
    }

    formExcel() {
        if (this._organization.id == 0) {
            this.report_export_msg.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите организацию' })
            return
        }

        let params = {
            _organization_id: this._organization.id,
            _date: this._date.toLocaleDateString() + ' ' + this._date.toLocaleTimeString(),
            tiprep: this.type_report,
            tipdoc: this.doc.type_doc,
            id_doc: this.doc.id,
            lang: this.language,
            format: 'xlsx'
        }

        this.report_export_Service
            .getreport_export_exl(params)
        // .subscribe
        // (data => {
        //     let blob: Blob = new Blob([data], { type: 'application/pdf' });
        //     let url = window.URL.createObjectURL(blob);
        //     this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        // })
    }

    changePrilozhenie() {
        this.url = ''
    }

    closeform() {
        this.closeEvent.emit()
    }

}
