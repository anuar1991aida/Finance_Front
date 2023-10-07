import { NgModule } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component/main.component';
import { SkeletonComponent } from './loader/skeleton/skeleton.component'
import { PrimeModules } from './primeng.module'
import { MegaMenuModule } from 'primeng/megamenu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TokenInterceptor } from './classes/token.interceptor';
// income
import { CategoryIncomeDetailComponent } from './directory/income/category-income/category-income-detail/category-income-detail.component';
import { CategoryIncomeComponent } from './directory/income/category-income/category_income-list/category-income.component';
import { ClassIncomeListComponent } from './directory/income/class-income/class-income-list/class-income-list.component';
import { ClassIncomeDetailComponent } from './directory/income/class-income/class-income-detail/class-income-detail.component';
import { ClassificationIncomeListComponent } from './directory/income/classification-income/classification-income-list/classification-income-list.component';
import { ClassificationIncomeDetailComponent } from './directory/income/classification-income/classification-income-detail/classification-income-detail.component';
import { UtvIncomeListComponent } from './documents/income/utv-income/utv-income-list/utv-income-list.component';
import { UtvIncomeDetailComponent } from './documents/income/utv-income/utv-income-detail/utv-income-detail.component';

//dirs/expenses

import { OrganizationComponent } from './directory/organization/organization-list/organization.component';
import { OrganizationDetailComponent } from './directory/organization/organization-detail/organization-detail.component';
import { PodclassListComponent } from './directory/income/podclass/podclass-list/podclass-list.component';
import { PodclassDetailComponent } from './directory/income/podclass/podclass-detail/podclass-detail.component';
import { BudjetListComponent } from './directory/income/budjet/budjet-list/budjet-list.component';
import { IzmIncDocDetailComponent } from './documents/income/izm_inc_doc/izm-inc-doc-detail/izm-inc-doc-detail.component';
import { IzmIncDocListComponent } from './documents/income/izm_inc_doc/izm-inc-doc-list/izm-inc-doc-list.component';
import { FunctionalGroupDetailComponent } from './directory/expenses/functional-group/functional-group-detail/functional-group-detail.component';
import { FunctionalGroupListComponent } from './directory/expenses/functional-group/functional-group-list/functional-group-list.component';
import { FunctionalGroupSelectComponent } from './directory/expenses/functional-group/functional-group-select/functional-group-select.component';
import { FunctionalPodgroupDetailComponent } from './directory/expenses/functional-podgroup/functional-podgroup-detail/functional-podgroup-detail.component';
import { FunctionalPodgroupListComponent } from './directory/expenses/functional-podgroup/functional-podgroup-list/functional-podgroup-list.component';
import { FunctionalPodgroupSelectComponent } from './directory/expenses/functional-podgroup/functional-podgroup-select/functional-podgroup-select.component';
import { ABPListComponent } from './directory/expenses/ABP/abp-list/abp-list.component';
import { ABPSelectComponent } from './directory/expenses/ABP/abp-select/abp-select.component';
import { ABPDetailComponent } from './directory/expenses/ABP/abp-detail/abp-detail.component';
import { ProgrammListComponent } from './directory/expenses/programm/programm-list/programm-list.component';
import { ProgrammSelectComponent } from './directory/expenses/programm/programm-select/programm-select.component';
import { ProgrammDetailComponent } from './directory/expenses/programm/programm-detail/programm-detail.component';
import { PodprogrammDetailComponent } from './directory/expenses/podprogramm/podprogramm-detail/podprogramm-detail.component';
import { PodprogrammListComponent } from './directory/expenses/podprogramm/podprogramm-list/podprogramm-list.component';
import { PodprogrammSelectComponent } from './directory/expenses/podprogramm/podprogramm-select/podprogramm-select.component';
import { FkrDetailComponent } from './directory/expenses/fkr/fkr-detail/fkr-detail.component';
import { FkrListComponent } from './directory/expenses/fkr/fkr-list/fkr-list.component';
import { FkrSelectComponent } from './directory/expenses/fkr/fkr-select/fkr-select.component';
import { SpecificationIncomeListComponent } from './directory/income/specification-income/specification-income-list/specification-income-list.component';
import { SpecificationIncomeDetailComponent } from './directory/income/specification-income/specification-income-detail/specification-income-detail.component';
import { UtvExpDocListComponent } from './documents/expenses/utv-exp-doc/utv-exp-doc-list/utv-exp-doc-list.component';
import { UtvExpDocDetailComponent } from './documents/expenses/utv-exp-doc/utv-exp-doc-detail/utv-exp-doc-detail.component';
import { Import219ListComponent } from './documents/import_document/import219/import219-list/import219-list.component';
import { Import219DeteailComponent } from './documents/import_document/import219/import219-deteail/import219-deteail.component';
import { UploadComponent } from './documents/import_document/import219/upload/upload.component';
import { SpecificationExpListComponent } from './directory/expenses/specification-exp/specification-exp-list/specification-exp-list.component';
import { SpecificationExpDetailComponent } from './directory/expenses/specification-exp/specification-exp-detail/specification-exp-detail.component';
import { SpecificationExpSelectComponent } from './directory/expenses/specification-exp/specification-exp-select/specification-exp-select.component';
import { BudjetSelectComponent } from './directory/income/budjet/budjet-select/budjet-select.component';
import { CategoryIncomeSelectComponent } from './directory/income/category-income/category_income-select/category-income-select.component';
import { ClassIncomeSelectComponent } from './directory/income/class-income/class-income-select/class-income-select.component';
import { ClassificationIncomeSelectComponent } from './directory/income/classification-income/classification-income-select/classification-income-select.component';
import { PodclassSelectComponent } from './directory/income/podclass/podclass-select/podclass-select.component';
import { SpecificationIncomeSelectComponent } from './directory/income/specification-income/specification-income-select/specification-income-select.component';
import { OrganizationSelectComponent } from './directory/organization/organization-select/organization-select.component';
import { Import420ListComponent } from './documents/import_document/import420/import420-list/import420-list.component';
import { Import420DetailComponent } from './documents/import_document/import420/import420-detail/import420-detail.component';
import { IzmPlatejiDetailComponent } from './documents/expenses/izm-plateji-doc/izm-plateji-detail/izm-plateji-detail.component';
import { IzmPlatejiListComponent } from './documents/expenses/izm-plateji-doc/izm-plateji-list/izm-plateji-list.component';
import { reportComponent } from './reports/report';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UserDetailComponent } from './directory/user/user-detail/user-detail.component';
import { UserListComponent } from './directory/user/user-list/user-list.component';
import { StartPageComponent } from './main/startpage/startpage.component';
import { UserhistoryDetailComponent } from './main/userhistory/userhistory-detail/userhistory-detail.component';
import { ChangepassComponent } from './services/changepass/changepass.component';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    PrimeModules,
    MegaMenuModule,
    AvatarModule,
    RouterModule.forRoot([{ path: 'login', component: LoginComponent }])
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    OrganizationComponent,
    OrganizationSelectComponent,
    OrganizationDetailComponent,
    CategoryIncomeComponent,
    CategoryIncomeSelectComponent,
    SkeletonComponent,
    PodclassListComponent,
    PodclassSelectComponent,
    PodclassDetailComponent,
    CategoryIncomeDetailComponent,
    ClassIncomeListComponent,
    ClassIncomeSelectComponent,
    ClassIncomeDetailComponent,
    SpecificationIncomeListComponent,
    SpecificationIncomeSelectComponent,
    SpecificationIncomeDetailComponent,
    ClassificationIncomeListComponent,
    ClassificationIncomeSelectComponent,
    ClassificationIncomeDetailComponent,
    SkeletonComponent,
    BudjetListComponent,
    BudjetSelectComponent,
    FunctionalGroupListComponent,
    FunctionalGroupSelectComponent,
    FunctionalGroupDetailComponent,
    FunctionalPodgroupListComponent,
    FunctionalPodgroupDetailComponent,
    FunctionalPodgroupSelectComponent,
    ABPListComponent,
    ABPSelectComponent,
    ABPDetailComponent,
    ProgrammListComponent,
    ProgrammDetailComponent,
    ProgrammSelectComponent,
    PodprogrammListComponent,
    PodprogrammSelectComponent,
    PodprogrammDetailComponent,
    FkrListComponent,
    FkrSelectComponent,
    FkrDetailComponent,
    UtvIncomeListComponent,
    UtvIncomeDetailComponent,
    UtvExpDocListComponent,
    UtvExpDocDetailComponent,
    SkeletonComponent,
    IzmIncDocDetailComponent,
    IzmIncDocListComponent,
    Import219ListComponent,
    Import219DeteailComponent,
    UploadComponent,
    SpecificationExpListComponent,
    SpecificationExpSelectComponent,
    SpecificationExpDetailComponent,
    Import420DetailComponent,
    Import420ListComponent,
    IzmPlatejiListComponent,
    IzmPlatejiDetailComponent,
    UserDetailComponent,
    UserListComponent,
    reportComponent,
    StartPageComponent,
    UserhistoryDetailComponent,
    ChangepassComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor,
    },
    MessageService,
    MainComponent,
    StartPageComponent,
    LoginComponent,
    ConfirmationService,
    DynamicDialogConfig
  ]
})
export class AppModule { }
