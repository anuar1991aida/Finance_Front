import { Component, EventEmitter, Injectable, Input, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { provideRouter, provideRoutes } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MainComponent } from 'src/app/main/main.component/main.component';
import { profileuser } from "../../login/interfaces";
import { report_37_39_Service } from "./report_37_39.service";
import { reportComponent } from '../report';
import { organization_detail } from "src/app/directory/organization/interfaces";
import { OrganizationDetailComponent } from "src/app/directory/organization/organization-detail/organization-detail.component";
import { OrganizationSelectComponent } from "src/app/directory/organization/organization-select/organization-select.component";
import { SvodSelectComponent } from "src/app/documents/expenses/svod_spravok/svod_spravok_select/svod-spravok-select.component";
import { svod_expenses_doc } from "src/app/documents/expenses/svod_spravok/interfaces";

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'report_37_39',
    templateUrl: './report_37_39.html'
})

export class report_37_39_Component {
    constructor(
        private MainComponent: MainComponent,
        private reportComponent: reportComponent,
        private Report_37_39_config: DynamicDialogConfig,
        private Report_37_39_Service: report_37_39_Service,
        private sanitizer: DomSanitizer,
        private Report_37_39_msg: MessageService,
        private Report_37_39_ref: DynamicDialogRef,
        private Report_37_39_dialog: DialogService,
        private Report_37_39_confirm: ConfirmationService
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
        { label: 'Приложение 37', value: 'obl' },
        { label: 'Приложение 39', value: 'pay' }
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
        this.doc = this.Report_37_39_config.data.doc || ''
    }

    form() {
        let params = {
            id: this.doc.id,
            tip_rep: this.prilozhenieValue,
            lang: this.language,
            tipdoc: this.doc.type_doc
        }

        this.Report_37_39_Service
            .getReport37_39(params)
            .subscribe
            (data => {
                let blob: Blob = new Blob([data], { type: 'application/pdf' });
                let url = window.URL.createObjectURL(blob);
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            })
    }

    selectDoc() {
        this.Report_37_39_ref = this.Report_37_39_dialog.open(SvodSelectComponent,
            {
                header: 'Выбор документа',
                width: '60%',
                height: '80%'
            })

        this.Report_37_39_ref.onClose.subscribe((doc: svod_expenses_doc) => {
            if (doc) {
                this.doc.id = doc.id,
                    this.name = 'Свод документов ' + doc.nom
            }
        })
    }

    changePrilozhenie() {
        this.url = ''
    }

    closeform() {
        this.closeEvent.emit()
    }

}
