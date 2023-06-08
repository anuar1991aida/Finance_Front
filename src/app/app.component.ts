import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "./login/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [MessageService, DialogService, DynamicDialogRef,]
})



export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {

  }

  ngOnInit(): void {
    let potentialToken = sessionStorage.getItem('auth-token')
    if (potentialToken !== null) {
      this.auth.setToken(potentialToken)
    }
  }
}
