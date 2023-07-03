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
import { MainComponent } from './main/main.component';
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
import { UserComponent } from './user/user.component';
import { UtvExpDocListComponent } from './documents/expenses/utv-exp-doc/utv-exp-doc-list/utv-exp-doc-list.component';
import { UtvExpDocDetailComponent } from './documents/expenses/utv-exp-doc/utv-exp-doc-detail/utv-exp-doc-detail.component';
import { Import219ListComponent } from './documents/import_document/import219/import219-list/import219-list.component';
import { Import219DeteailComponent } from './documents/import_document/import219/import219-deteail/import219-deteail.component';
import { UploadComponent } from './documents/import_document/import219/upload/upload.component';
import { SpecificationExpListComponent } from './directory/expenses/specification-exp/specification-exp-list/specification-exp-list.component';
import { SpecificationExpDetailComponent } from './directory/expenses/specification-exp/specification-exp-detail/specification-exp-detail.component';

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
    OrganizationDetailComponent,
    CategoryIncomeComponent,
    SkeletonComponent,
    PodclassListComponent,
    PodclassDetailComponent,
    CategoryIncomeDetailComponent,
    ClassIncomeListComponent,
    ClassIncomeDetailComponent,
    SpecificationIncomeListComponent,
    SpecificationIncomeDetailComponent,
    ClassificationIncomeListComponent,
    ClassificationIncomeDetailComponent,
    SkeletonComponent,
    BudjetListComponent,
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
    SpecificationExpDetailComponent,
    UserComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    },
    MessageService,
    ConfirmationService
  ]
})
export class AppModule { }
