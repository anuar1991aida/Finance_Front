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
import { MessageService } from 'primeng/api';
import { TokenInterceptor } from './classes/token.interceptor';


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
    SkeletonComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    },
    MessageService
  ]
})
export class AppModule { }
