import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from './auth.service';
import { body } from './interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private msgLogin: MessageService) { }

  form: FormGroup
  loading = true
  body: body

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    })

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        // Теперь вы можете зайти используя свои данные
      }
      else if (params['accessDenied']) {
        console.log('accessDenied');
      }
      else if (params['sessionfailed']) {
        console.log('Войди в систему заново');
      }
    })
  }

  onSubmit() {
    this.form.disable()
    this.auth.login(this.form.value)
      .subscribe(
        () => {
          sessionStorage.setItem("username", this.form.value.username),
            this.router.navigate([''])
          // this.checkLoogin(this.form.value.username, 'ok')        
        },
        error => {
          this.form.enable(),
            // this.checkLoogin(this.form.value.username, 'error'),
            this.msgLogin.add({
              severity: 'error', summary: 'Ошибка', detail: 'Логин или пароль неверный!'
            })
        }
      )
  }

  checkLoogin(login: string, status: string) {

    // this.body =
    // {
    //   "username": login,
    //   "status": status
    // }

    // this.auth.checkLogin(this.body)
    //   .subscribe(
    //     (data) => (
    //       sessionStorage.setItem("username", this.form.value.username),
    //       this.router.navigate([''])
    //     )
    //   )





  }
}
