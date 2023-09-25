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

    ngOnInit() {
        this.url = this.config.data.url || '';
    }
}
