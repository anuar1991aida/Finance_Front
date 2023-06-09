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
import { OrganizationComponent } from './organization/organization-list/organization.component';
import { OrganizationDetailComponent } from './organization/organization-detail/organization-detail.component';
import { CategoryIncomeComponent } from './category-income/category_income-list/category-income.component';
import { SkeletonComponent } from './loader/skeleton/skeleton.component'

import { PrimeModules } from './primeng.module'
import { MegaMenuModule } from 'primeng/megamenu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TokenInterceptor } from './classes/token.interceptor';
import { CategoryIncomeDetailComponent } from './category-income/category-income-detail/category-income-detail.component';
import { ClassIncomeListComponent } from './class-income/class-income-list/class-income-list.component';
import { ClassIncomeDetailComponent } from './class-income/class-income-detail/class-income-detail.component';
import { SpecificationIncomeListComponent } from './specification-income/specification-income-list/specification-income-list.component';
import { SpecificationIncomeDetailComponent } from './specification-income/specification-income-detail/specification-income-detail.component';
import { ClassificationIncomeListComponent } from './classification-income/classification-income-list/classification-income-list.component';
import { ClassificationIncomeDetailComponent } from './classification-income/classification-income-detail/classification-income-detail.component';


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
    CategoryIncomeDetailComponent,
    ClassIncomeListComponent,
    ClassIncomeDetailComponent,
    SpecificationIncomeListComponent,
    SpecificationIncomeDetailComponent,
    ClassificationIncomeListComponent,
    ClassificationIncomeDetailComponent,
    SkeletonComponent],
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
