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
import { MainComponent } from 'src/app/main/main.component';
import { profileuser } from "../login/interfaces";
import { ReportService } from "./reports.service";
import { BudjetSelectComponent } from "../directory/income/budjet/budjet-select/budjet-select.component";
import { Budjet_detail } from "../directory/income/budjet/interfaces";
import { IzmIncDocListComponent } from "../documents/income/izm_inc_doc/izm-inc-doc-list/izm-inc-doc-list.component";
import { izm_inc_doc } from "../documents/income/izm_inc_doc/interfaces";

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'report-detail',
    templateUrl: './report.html'
})

export class reportComponent {
    constructor(
        private MainComponent: MainComponent,
        private Reportconfig: DynamicDialogConfig,
        private ReportService: ReportService,
        private sanitizer: DomSanitizer,
        private Reportmsg: MessageService,
        private Reportref: DynamicDialogRef,
        private Reportdialog: DialogService,
        private Reportconfirm: ConfirmationService,) {
        this.profileuser = this.MainComponent.profileuser
    }

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
    _date: Date = new Date;
    profileuser: profileuser
    language = 'kaz'
    name = ''
    prilozhenieValue = 'pay'
    prilozhenieType: any = []
    _organization = {
        'id': 0,
        'name': ''
    }
    _budjet = {
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
                if (this.doc.type_doc = 'izm-inc') {
                    this.name = 'Изменения плана по поступлениям ' + this.doc.nom
                }
            }
        }
        else {
            if (this.type_report == '2-5') {
                this.prilozhenieType = [
                    { label: 'Приложение 2', value: 'pay' },
                    { label: 'Приложение 5', value: 'obl' }
                ]
                this._organization = {
                    id: parseInt(this.profileuser.org_id),
                    name: this.profileuser.org_name
                }
            }
            else if (this.type_report == 'prilozhenie14') {
                this.prilozhenieType = [
                    { label: 'Приложение 14', value: 'pay' }
                ]
                this._budjet = {
                    id: parseInt(this.profileuser.budjet_id),
                    name: this.profileuser.budjet_name
                }
            }
        }

        console.log(this._budjet);



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
                console.log(org);

                // this._organization.id = org.id,
                //     this._organization.name = org.name_rus
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

    selectBudjet() {
        this.Reportref = this.Reportdialog.open(BudjetSelectComponent,
            {
                header: 'Выбор бюджета',
                width: '60%',
                height: '80%'
            })

        this.Reportref.onClose.subscribe((budjet_detail: Budjet_detail) => {
            if (budjet_detail) {
                this._budjet.id = budjet_detail.id,
                    this._budjet.name = budjet_detail.name_rus
            }
        })
    }

    selectDoc() {
        if (this.doc.type_doc == 'izm-exp') {
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
        else if (this.doc.type_doc == 'izm-inc') {
            this.Reportref = this.Reportdialog.open(IzmIncDocListComponent,
                {
                    header: 'Выбор документа',
                    width: '60%',
                    height: '80%'
                })

            this.Reportref.onClose.subscribe((doc: izm_inc_doc) => {
                if (doc) {
                    this.doc.id = doc.id,
                        this.name = 'Изменения плана по поступлениям ' + doc.nom
                }
            })
        }
    }


    form() {

        if (this.type_report == '2-5') {
            if (this._organization.id == 0) {
                this.Reportmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите организацию' })
                return
            }
        }
        else if (this.doc.service == 'report2728' || this.doc.service == 'report2930' || this.doc.service == 'report25') {
            if (this.doc.id == 0) {
                this.Reportmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите документ' })
                return
            }
        }
        else if (this.type_report == 'prilozhenie14') {
            if (this._budjet.id == 0) {
                this.Reportmsg.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите бюджет' })
                return
            }
        }



        if (this.doc.service == 'report2728') {
            this.formReport2728()
        }
        else if (this.doc.service == 'report25') {
            this.formReport25()
        }
        else if (this.doc.service == 'report2930') {
            this.formReport2930()
        }
        else if (this.doc.service == 'report3335') {
            this.formReport3335()
        }
        else if (this.type_report == '2-5') {
            this.formReport2_5()
        }
        else if (this.type_report == 'prilozhenie14') {
            this.formReport14()
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

    formReport14() {

        let params = {
            _budjet_id: this._budjet.id,
            _date: this._date.toLocaleDateString() + ' ' + this._date.toLocaleTimeString()
        }

        this.ReportService
            .getReport14(params)
            .subscribe
            (data => {
                let blob: Blob = new Blob([data], { type: 'application/pdf' });
                let url = window.URL.createObjectURL(blob);
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            })
    }

    formReport25() {

        let params = {
            _izm_inc_id: this.doc.id
        }

        this.ReportService
            .getReport25(params)
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

    formReport3335() {

        let params = {
            id: this.doc.id,
            tip_rep: this.prilozhenieValue
        }

        this.ReportService
            .getReport33_35(params)
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
