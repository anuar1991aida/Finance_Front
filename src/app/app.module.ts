import { NgModule } from '@angular/core';
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
import { CategoryIncomeComponent } from './directory/category-income/category_income-list/category-income.component';
import { SkeletonComponent } from './loader/skeleton/skeleton.component'
import { PrimeModules } from './primeng.module'
import { MegaMenuModule } from 'primeng/megamenu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TokenInterceptor } from './classes/token.interceptor';
import { CategoryIncomeDetailComponent } from './directory/category-income/category-income-detail/category-income-detail.component';
import { ClassIncomeListComponent } from './directory/class-income/class-income-list/class-income-list.component';
import { ClassIncomeDetailComponent } from './directory/class-income/class-income-detail/class-income-detail.component';
import { SpecificationIncomeListComponent } from './directory/specification-income/specification-income-list/specification-income-list.component';
import { SpecificationIncomeDetailComponent } from './directory/specification-income/specification-income-detail/specification-income-detail.component';
import { ClassificationIncomeListComponent } from './directory/classification-income/classification-income-list/classification-income-list.component';
import { ClassificationIncomeDetailComponent } from './directory/classification-income/classification-income-detail/classification-income-detail.component';
import { UtvIncomeListComponent } from './documents/utv-income/utv-income-list/utv-income-list.component';
import { UtvIncomeDetailComponent } from './documents/utv-income/utv-income-detail/utv-income-detail.component';
//Dastan
import { OrganizationComponent } from './directory/organization/organization-list/organization.component';
import { OrganizationDetailComponent } from './directory/organization/organization-detail/organization-detail.component';
import { PodclassListComponent } from './directory/podclass/podclass-list/podclass-list.component';
import { PodclassDetailComponent } from './directory/podclass/podclass-detail/podclass-detail.component';
import { BudjetListComponent } from './directory/budjet/budjet-list/budjet-list.component';
import { IzmIncDocDetailComponent } from './documents/izm_inc_doc/izm-inc-doc-detail/izm-inc-doc-detail.component';
import { IzmIncDocListComponent } from './documents/izm_inc_doc/izm-inc-doc-list/izm-inc-doc-list.component';

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
    UtvIncomeListComponent,
    UtvIncomeDetailComponent,
    SkeletonComponent,
    IzmIncDocComponent,
    IzmIncDocDetailComponent,
    IzmIncDocListComponent],
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
