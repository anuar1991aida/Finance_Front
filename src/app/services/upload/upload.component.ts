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
    public configupload: DynamicDialogConfig,
    private uploadServise: uploadServise) { }

  ngOnInit(): void {
  }

  onUpload(event: any) {

    let file = event.files[0];

    let reader = new FileReader();

    reader.readAsDataURL(file as Blob);
    reader.onload = () => {
      this.send_file(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }


  send_file(reader: any) {
    this.uploadServise
      .send_file_420({ "file": reader, "type": this.configupload.data })
      .subscribe(
        (data) => (this.messageServiceUpload.add({ severity: 'success', summary: 'Успешно', detail: 'Импорт данных завершен!' })),
        (error) => (this.messageServiceUpload.add({ severity: 'error', summary: 'Ошибка', detail: 'Импорт данных завершен!' })));
  }
}
