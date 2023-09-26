import { Component, Injectable } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'report-detail',
    templateUrl: './report.html'
})

export class reportComponent {
    constructor(
        private config: DynamicDialogConfig) { }

    url = ''
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

        this.url = this.config.data.url || '';
        this.doc = this.config.data.doc || '';

        if (this.doc) {
            if (this.doc.type_doc = 'izm-exp') {
                this.name = 'Изменения плана по расходам ' + this.doc.nom
            }

        }

    }

    selectDoc() {

    }

    form() {

    }
}
