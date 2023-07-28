import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { import420Servise } from '../import420.servise';

@Component({
  selector: 'app-import420-list',
  templateUrl: './import420-list.component.html',
  styleUrls: ['./import420-list.component.css']
})
export class Import420ListComponent implements OnInit {

  constructor(
    private service420: import420Servise,
    private msgService420: MessageService,
  ) { }

  ngOnInit(): void {
    this.service420
      .send_file()
      .subscribe(
        (data) => (this.msgService420.add({ severity: 'success', summary: 'Успешно', detail: 'Импорт данных завершен!' })),
        (error) => (this.msgService420.add({ severity: 'error', summary: 'Ошибка', detail: 'Импорт данных завершен!' })));
  }

}
