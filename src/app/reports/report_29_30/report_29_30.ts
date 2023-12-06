import { Component, EventEmitter, Injectable, Input, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { provideRouter, provideRoutes } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MainComponent } from 'src/app/main/main.component/main.component';
import { profileuser } from "../../login/interfaces";
import { report_29_30_Service } from "./report_29_30.service";
import { reportComponent } from '../report';
import { organization_detail } from "src/app/directory/organization/interfaces";
import { OrganizationDetailComponent } from "src/app/directory/organization/organization-detail/organization-detail.component";
import { OrganizationSelectComponent } from "src/app/directory/organization/organization-select/organization-select.component";
import { IzmIncDocListComponent } from "src/app/documents/income/izm_inc_doc/izm-inc-doc-list/izm-inc-doc-list.component";
import { izm_inc_doc } from "src/app/documents/income/izm_inc_doc/interfaces";

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'report_29_30',
    templateUrl: './report_29_30.html'
})

export class report_29_30_Component {
    constructor(
        private MainComponent: MainComponent,
        private reportComponent: reportComponent,
        private Report_29_30_config: DynamicDialogConfig,
        private Report_29_30_Service: report_29_30_Service,
        private sanitizer: DomSanitizer,
        private Report_29_30_msg: MessageService,
        private Report_29_30_ref: DynamicDialogRef,
        private Report_29_30_dialog: DialogService,
        private Report_29_30_confirm: ConfirmationService
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
    doc = {
        'id': 0,
        'nom': '',
        'name': '',
        'type_doc': ''
    }
    prilozhenieValue = 'obl'
    prilozhenieType = [
        { label: 'Приложение 29', value: 'obl' },
        { label: 'Приложение 30', value: 'pay' }
    ]
    _organization = {
        'id': 0,
        'name': ''
    }
    langOptions = [
        { label: 'Қазақша', value: 'kaz' },
        { label: 'Русский', value: 'rus' }
    ]

    ngOnInit() {
        this.doc = this.Report_29_30_config.data.doc || ''
    }

    selectDoc() {
        this.Report_29_30_ref = this.Report_29_30_dialog.open(IzmIncDocListComponent,
            {
                header: 'Выбор документа',
                width: '60%',
                height: '80%'
            })

        this.Report_29_30_ref.onClose.subscribe((doc: izm_inc_doc) => {
            if (doc) {
                this.doc.id = doc.id,
                    this.doc.name = 'Изменения плана по поступлениям ' + doc.nom
            }
        })
    }

    form() {
        let params = {
            id: this.doc.id,
            tip_rep: this.prilozhenieValue,
            lang: this.language,
            tipdoc: this.doc.type_doc
        }

        this.Report_29_30_Service
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

    closeform() {
        this.closeEvent.emit()
    }

}
