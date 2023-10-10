import { Component, OnInit } from "@angular/core";
import { MessageService, PrimeNGConfig } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "./login/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [MessageService, DialogService, DynamicDialogRef,]
})



export class AppComponent implements OnInit {
  constructor(
    private config: PrimeNGConfig,
    private auth: AuthService) {

  }

  ngOnInit(): void {
    let potentialToken = sessionStorage.getItem('auth-token')
    if (potentialToken !== null) {
      this.auth.setToken(potentialToken)
    }

    this.config.setTranslation({
      monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      monthNamesShort: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      weak: 'Легкий',
      medium: 'Средний',
      strong: 'Сложный',
      passwordPrompt: 'Введите пароль',
      firstDayOfWeek: 1
    })
  }
}
