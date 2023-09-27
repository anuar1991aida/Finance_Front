import { Component, EventEmitter, Injectable, Input, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { provideRouter, provideRoutes } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { organization_detail } from "../directory/organization/interfaces";
import { OrganizationDetailComponent } from "../directory/organization/organization-detail/organization-detail.component";
import { OrganizationSelectComponent } from "../directory/organization/organization-select/organization-select.component";
import { izm_plateji_doc } from "../documents/expenses/izm-plateji-doc/interfaces";
import { IzmPlatejiListComponent } from "../documents/expenses/izm-plateji-doc/izm-plateji-list/izm-plateji-list.component";
import { ReportService } from "./reports.service";

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'report-detail',
    templateUrl: './report.html'
})

export class reportComponent {
    constructor(
        private Reportconfig: DynamicDialogConfig,
        private ReportService: ReportService,
        private sanitizer: DomSanitizer,
        private Reportmsg: MessageService,
        private Reportref: DynamicDialogRef,
        private Reportdialog: DialogService,
        private Reportconfirm: ConfirmationService,) { }

    @Input() type_report = ''
    @Output() closeEvent = new EventEmitter<any>()

    url: any = ''
    doc = {
        'id': 0,
        'nom': '',
        'type_doc': '',
        'service': '',
        'prilozhenieValue': '',
        'prilozhenieType': []
    }

    language = 'kaz'
    name = ''
    prilozhenieValue = 'pay'
    prilozhenieType: any = []
    _organization = {
        'id': 0,
        'name': ''
    }
    langOptions = [
        { label: 'Казахша', value: 'kaz' },
        { label: 'Русский', value: 'rus' }
    ]

    ngOnInit() {

        if (this.type_report == '') {
            this.doc = this.Reportconfig.data.doc || '';

            if (this.doc) {
                this.prilozhenieType = this.doc.prilozhenieType
                if (this.doc.type_doc = 'izm-exp') {
                    this.name = 'Изменения плана по расходам ' + this.doc.nom
                }
            }
        }
        else {
            if (this.type_report == '2-5') {
                this.prilozhenieType = [
                    { label: 'Приложение 2', value: 'pay' },
                    { label: 'Приложение 5', value: 'obl' }
                ]
            }
        }
    }

    viewOrg() {
        this.Reportref = this.Reportdialog.open(OrganizationDetailComponent,
            {
                header: 'Редактирование организации',
                width: '60%',
                height: '80%',
                data: { org_id: this._organization.id }
            })

        this.Reportref.onClose.subscribe((org: organization_detail) => {
            if (org) {
                this._organization.id = org.id,
                    this._organization.name = org.name_rus
            }
        })
    }

    selectOrg() {
        this.Reportref = this.Reportdialog.open(OrganizationSelectComponent,
            {
                header: 'Выбор организации',
                width: '60%',
                height: '80%'
            })

        this.Reportref.onClose.subscribe((org: organization_detail) => {
            if (org) {
                this._organization.id = org.id,
                    this._organization.name = org.name_rus
            }
        })
    }

    selectDoc() {
        this.Reportref = this.Reportdialog.open(IzmPlatejiListComponent,
            {
                header: 'Выбор документа',
                width: '60%',
                height: '80%'
            })

        this.Reportref.onClose.subscribe((doc: izm_plateji_doc) => {
            if (doc) {
                this.doc.id = doc.id,
                    this.name = 'Изменения плана по расходам ' + doc.nom
            }
        })
    }

    form() {

        if (this.doc.service == 'report2728') {
            this.formReport2728()
        }
        else if (this.doc.service == 'report2930') {
            this.formReport2930()
        }
        else if (this.type_report == '2-5') {
            this.formReport2_5()
        }
    }

    formReport2_5() {

        let params = {
            _organization_id: this._organization.id,
            tip_rep: this.prilozhenieValue
        }

        this.ReportService
            .getReport2_5(params)
            .subscribe
            (data => {
                let blob: Blob = new Blob([data], { type: 'application/pdf' });
                let url = window.URL.createObjectURL(blob);
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            })
    }

    formReport2728() {

        let params = {
            id: this.doc.id,
            tip_rep: this.prilozhenieValue
        }

        this.ReportService
            .getReport27_28(params)
            .subscribe
            (data => {
                let blob: Blob = new Blob([data], { type: 'application/pdf' });
                let url = window.URL.createObjectURL(blob);
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            })

    }

    formReport2930() {

        let params = {
            id: this.doc.id,
            tip_rep: this.prilozhenieValue
        }

        this.ReportService
            .getReport29_30(params)
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


}
