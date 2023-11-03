import { Component, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MegaMenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService } from '../../login/auth.service';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { profileuser } from './interfaces';
import { MainService } from './main.service'
import { UserhistoryDetailComponent } from '../userhistory/userhistory-detail/userhistory-detail.component';
import { ChangepassComponent } from 'src/app/services/changepass/changepass.component';
import { UploadComponent } from 'src/app/services/upload/upload.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private mainservice: MainService,
    private mainmsg: MessageService,
    private dialog_form: DialogService,
    private ref: DynamicDialogRef,
    private router: Router) {
  }

  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true })
  viewContainerRef: ViewContainerRef;
  @ViewChild('templateRef', { read: TemplateRef, static: true })
  templateRef: TemplateRef<any>;
  @HostListener('window:keydown', ['$event'])
  @HostListener('window:mousemove', ['$event'])

  onKeyDown(event: KeyboardEvent) {
    this.checkEvent()
  }

  onMouseMove(event: MouseEvent) {
    this.checkEvent()

  }

  checkEvent() {
    let newEventDatetime = new Date
    let raznica = (newEventDatetime.getTime() - this.lastEvent.getTime()) / 1000
    if (raznica > 30000) {

      if (this.quit == false) {
        this.quit = true
        this.mainmsg.add({
          severity: 'error', summary: 'Ошибка', detail: 'Время сессии истекло! Войдите заново!'
        })
        setTimeout(() => {
          this.logout()
        }, 2000)
      }


    }
    else {
      this.lastEvent = new Date;
    }
  }

  quit = false
  lastEvent = new Date();
  items: MegaMenuItem[];
  mass_tabs: string[] = [];
  tabcount = 0;
  number = '';
  counttabs = 0;
  User: MenuModule[];
  first = 0
  rows = 25
  history = []
  roles = []

  profileuser: profileuser = {
    user_id: '',
    username: '',
    first_name: '',
    org_id: '',
    org_name: '',
    budjet_id: '',
    budjet_name: ''
  }

  ngOnInit(): void {
    let responce: any

    this.mainservice
      .getinfo()
      .subscribe(
        (data) => (
          responce = data,
          this.profileuser.user_id = responce.user.id,
          this.profileuser.first_name = responce.user.first_name,
          this.profileuser.username = responce.user.username,
          this.profileuser.org_id = responce.profile._organization.id,
          this.profileuser.org_name = responce.profile._organization.name_rus,
          this.profileuser.budjet_id = responce.profile._organization._budjet.id,
          this.profileuser.budjet_name = responce.profile._organization._budjet.name_rus,
          this.roles = responce.roles,
          this.history = responce.history,
          this.formMenu(),
          this.openTab("startpage-element", "Начальная страница", ''))
      )

  }

  formMenu() {

    this.items = [
      {
        label: 'Справочники',
        icon: 'pi pi-fw pi-folder',
        items: [
          [
            {
              label: 'Администрирование',
              items: [{
                label: 'Организации',
                command: () => this.openTab('app-organization', 'Организации', '')
              },
              {
                label: 'Пользователи',
                command: () => this.openTab('app-user-list', 'Пользователи', '')
              },
              {
                label: 'Погашение КП',
                command: () => this.openTab('app-pogashenie-kp-list', 'Погашение КП', '')
              },
              {
                label: 'Погашение ФКР',
                command: () => this.openTab('app-pogashenie-fkr-list', 'Погашение ФКР', '')
              }
              ]
            }
          ],
          [
            {
              label: 'Расходы',
              items: [{
                label: 'Функциональные группы',
                command: () => this.openTab('app-functional-group-list', 'Функциональные группы', '', true)
              }, {
                label: 'Функциональные подгруппы',
                command: () => this.openTab('app-functional-podgroup-list', 'Функциональные подгруппы', '', true)
              },
              {
                label: 'АБП',
                command: () => this.openTab('app-abp-list', 'АБП', '', true)
              },
              {
                label: 'Программы',
                command: () => this.openTab('app-programm-list', 'Программы', '', true)
              }, {
                label: 'Подпрограммы',
                command: () => this.openTab('app-podprogramm-list', 'Подпрограммы', '', true)
              }, {
                label: 'ФКР',
                command: () => this.openTab('app-fkr-list', 'ФКР', '', true)
              }, {
                label: 'Спецификации',
                command: () => this.openTab('app-specification-exp-list', 'Спецификации', '')
              }]
            }
          ],
          [
            {
              label: 'Доходы',
              items: [{
                label: 'Категории',
                command: () => this.openTab('app-category-income', 'Категории', '')
              }, {
                label: 'Классы',
                command: () => this.openTab('app-class-income-list', 'Классы', '')
              }, {
                label: 'Подклассы',
                command: () => this.openTab('app-podclass-list', 'Подклассы', '')
              }, {
                label: 'Спецификации',
                command: () => this.openTab('app-specification-income-list', 'Спецификации', '')
              }, {
                label: 'Бюджет',
                command: () => this.openTab('app-budjet-list', 'Бюджет', '')
              }, {
                label: 'Классификации',
                command: () => this.openTab('app-classification-income-list', 'Классификации', '', true)
              }]
            }
          ]
        ]
      },
      {
        label: 'Документы',
        icon: 'pi pi-fw pi-file',
        items: [
          [
            {
              label: 'Поступления',
              items: [{
                label: 'Утвержденный план по поступлениям',
                command: () => this.openTab('app-utv-income-list', 'Утвержденный план по поступлениям', '')
              }, {
                label: 'Изменения плана по поступлениям',
                command: () => this.openTab('app-izm-inc-doc-list', 'Изменения плана по поступлениям', '')
              }]
            }
          ],
          [
            {
              label: 'Расходы',
              items: [{
                label: 'Утвержденный план по расходам',
                command: () => this.openTab('app-utv-exp-doc-list', 'Утвержденный план по расходам', '')
              },
              {
                label: 'Изменения плана по расходам',
                command: () => this.openTab('app-izm-plateji-list', 'Изменения плана по расходам', '')
              },
              {
                label: 'Свод справок',
                command: () => this.openTab('app-svod-spravok-list', 'Свод справок', '')
              }]
            }
          ]
        ]
      },
      {
        label: 'Импорт',
        icon: 'pi pi-fw pi-file-import',
        items: [
          [
            {
              items: [{
                label: 'Импорт формы 2-19',
                command: () => this.openTab('app-import219-list', 'Импорт формы 2-19', '')
              },
              {
                label: 'Импорт формы 4-20',
                command: () => this.openTab('app-import420-list', 'Импорт формы 4-20', '')
              }]
            }
          ]
        ]
      },
      {
        label: 'Отчеты',
        icon: 'pi pi-fw pi-file-excel',
        items: [
          [
            {
              items: [{
                label: 'Приложение 2-5',
                command: () => this.openTab('report-detail', 'Приложение 2-5', '2-5')
              },
              {
                label: 'Приложение 14',
                command: () => this.openTab('report-detail', 'Приложение 14', 'prilozhenie14')
              },
              {
                label: 'Приложение 8-10',
                command: () => this.openTab('report_8_10', 'Приложение 8-10', '')
              }]
            }
          ]]
      },
      // {
      //   label: 'Quit',
      //   icon: 'pi pi-fw pi-power-off',
      //   command: () => this.logout()
      // }
    ]
  }

  openTab(nameselector: string, nametitle: string, id: string, data?: any) {
    let flag = 0;
    //Предварителная проверка существования вкладки
    this.mass_tabs.forEach((element, index) => {
      if (element == nametitle) {
        flag = index  //если открыта. то передаем индекс
      }
    });

    //если флаг больше 0, тогда открываем уже существующую, передав индекс
    if (flag > 0) {
      this.tabcount = flag
    }
    //иначе если = 0 тогда создаем новую вкладку
    else {
      this.mass_tabs.push(nametitle);
      this.number = id;
      this.viewContainerRef.createEmbeddedView(this.templateRef, { context: { selector: nameselector, title: nametitle, data: data } });
      this.counttabs++
      this.tabcount = this.counttabs - 1;
    }

  }

  openUpload(type_import: string) {
    this.ref = this.dialog_form.open(UploadComponent, {
      header: 'Загрузка PDF',
      width: 'calc(50%)',
      height: 'calc(50%)',
      data: { type_import: type_import }
    })
  }

  changepass() {
    this.ref = this.dialog_form.open(ChangepassComponent, {
      header: 'Изменение пароля пользователя',
      width: 'calc(40%)',
      height: 'calc(40%)',
      closable: true
    }),
      this.ref.onClose.subscribe((success: boolean) => {

        if (success) {

          setTimeout(() => {
            sessionStorage.clear(),
              this.auth.setToken(''),
              this.router.navigate(['login'])
          }, 1500)
        }
      })
  }

  userHistory() {
    this.ref = this.dialog_form.open(UserhistoryDetailComponent, {
      header: 'История входа учетной записи',
      width: 'calc(50%)',
      height: 'calc(50%)',
      closable: true,
      data: { history: this.history }
    })
  }

  logout() {
    this.auth
      .logout()
      .subscribe(
        () => this.router.navigate(['login']),
        error => {
          console.warn(console.error())
        }
      )
  }

  removetab() {
    if (this.tabcount > 0) {
      this.counttabs--
      this.viewContainerRef.detach(this.tabcount)?.destroy;
      this.mass_tabs.splice(this.tabcount, 1);
    }
  }
}

