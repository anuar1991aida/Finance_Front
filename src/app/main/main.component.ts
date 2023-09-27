import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MegaMenuItem, PrimeNGConfig } from 'primeng/api';
import { AuthService } from '../login/auth.service';
import { MenuModule } from 'primeng/menu';
import { UserComponent } from '../user/user.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private config: PrimeNGConfig,
    private dialog_form: DialogService,
    private user_massage: MessageService,
    private user_ref: DynamicDialogRef,
    private router: Router) { }

  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true })
  viewContainerRef: ViewContainerRef;
  @ViewChild('templateRef', { read: TemplateRef, static: true })
  templateRef: TemplateRef<any>;

  items: MegaMenuItem[];
  mass_tabs: string[] = [];
  tabcount = 0;
  number = '';
  counttabs = 0;
  User: MenuModule[];
  username = ''
  first = 0
  rows = 25

  ngOnInit(): void {
    this.User = [

      { label: 'Изменить пароль', icon: 'pi pi-fw pi-lock', command: this.changepass },
      { label: 'Выйти из системы', icon: 'pi pi-fw pi-power-off', command: this.logout }
    ]
    const username = sessionStorage.getItem("username");
    this.username = username !== null ? username : '';

    this.items = [
      {
        label: 'Справочники',
        icon: 'pi pi-fw pi-folder',
        items: [
          [
            {
              label: 'Организация',
              items: [{
                label: 'Организации',
                command: () => this.openTab('app-organization', 'Организации', '')
              }]
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
              }]
            }
          ],
          [
            {
              label: 'Импорт данных',
              items: [{
                label: 'Импорт формы 2-19',
                command: () => this.openTab('app-import219-deteail', 'Импорт формы 2-19', '')
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
        icon: 'pi pi-fw pi-file',
        items: [
          [
            {
              items: [{
                label: 'Приложение 2-5',
                command: () => this.openTab('report-detail', 'Приложение 2-5', '2-5')
              }]
            }
          ]]
      },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.logout()
      }
    ]

    this.config.setTranslation({
      monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      monthNamesShort: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      firstDayOfWeek: 1
    })



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

  changepass() {
    this.user_ref = this.dialog_form.open(UserComponent,
      {
        header: 'Изменение пароля пользователя',
        width: 'calc(40%)',
        height: 'calc(30%)',
        closable: true
      });

    this.user_ref.onClose.subscribe((save: boolean) => {
      if (save) {
        this.user_massage.add({ severity: 'success', summary: 'Успешно', detail: 'Пароль изменен! Войдите, пожалуйста, в систему!' }),
          this.router.navigate(['login'])
      }
    });
  }

  logout() {
    this.auth.logout().subscribe(
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

