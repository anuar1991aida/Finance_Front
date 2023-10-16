import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { uploadServise } from './upload.services';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(
    private messageServiceUpload: MessageService,
    public upload_config: DynamicDialogConfig,
    private uploadServise: uploadServise) { }

  type_import = ''
  mass_file: any = []
  spinner = false
  ngOnInit(): void {
    this.type_import = this.upload_config.data.type_import || ''
    console.log(this.type_import);

  }

  onUpload(event: any) {
    this.mass_file = []

    setTimeout(() => { this.send_file() }, 1000)
    this.pushToArray(event)

  }

  pushToArray(event: any) {

    let files = event.files;

    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(files[i] as Blob);
      reader.onload = () => {
        let base64 = reader.result
        this.mass_file.push(base64)
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  }

  send_file() {
    this.spinner = true
    let responce: any
    if (this.type_import == '4_20') {
      this.uploadServise
        .send_file_420({ "file": this.mass_file, "type": this.upload_config.data })
        .subscribe(
          (data) => (responce = data, this.spinner = false, this.messageServiceUpload.add({ severity: 'success', summary: 'Успешно', detail: responce.status })),
          (error) => (this.spinner = false, this.messageServiceUpload.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })))
    }
    else if (this.type_import == '2_19') {
      this.uploadServise
        .send_file_219({ "file": this.mass_file, "type": this.upload_config.data })
        .subscribe(
          (data) => (responce = data, this.spinner = false, this.messageServiceUpload.add({ severity: 'success', summary: 'Успешно', detail: responce.status })),
          (error) => (this.spinner = false, this.messageServiceUpload.add({ severity: 'error', summary: 'Ошибка', detail: error.error.status })))
    }
  }

}
