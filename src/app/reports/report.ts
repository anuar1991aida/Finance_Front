import { Component, Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { IzmPlatezhiService } from "../documents/expenses/izm-plateji-doc/izm-plateji.services";

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'report-detail',
    templateUrl: './report.html'
})

export class reportComponent {
    constructor(
        private config: DynamicDialogConfig,
        private izmPlatezhiDetailService: IzmPlatezhiService,
        private sanitizer: DomSanitizer) { }

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
    prilozhenieValue = ''

    langOptions = [
        { label: 'Казахша', value: 'kaz' },
        { label: 'Русский', value: 'rus' }
    ]



    ngOnInit() {

        // this.url = this.config.data.url || '';
        this.doc = this.config.data.doc || '';
        console.log(this.doc);

        if (this.doc) {
            if (this.doc.type_doc = 'izm-exp') {
                this.name = 'Изменения плана по расходам ' + this.doc.nom
            }
        }
    }

    selectDoc() {

    }

    form() {

        let params = {
            id: this.doc.id,
            tip_rep: this.doc.prilozhenieValue
        }

        if (this.doc.service == 'report2728') {
            this.formReport2728(params)
        }
        else if (this.doc.service == 'report2930') {
            this.formReport2930(params)
        }
    }

    formReport2930(params: any) {

        this.izmPlatezhiDetailService
            .getReport2930(params)
            .subscribe
            (data => {
                let blob: Blob = new Blob([data], { type: 'application/pdf' });
                let url = window.URL.createObjectURL(blob);
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            })
    }

    formReport2728(params: any) {

        this.izmPlatezhiDetailService
            .getReport2728(params)
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
