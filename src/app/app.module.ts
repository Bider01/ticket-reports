import {NgModule, APP_INITIALIZER} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {BasicAuthInterceptor, ErrorInterceptor, VariationPipe} from './_helpers';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {MatTableResponsiveModule} from './home/mat-table-responsive/mat-table-responsive.module';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {EditDialog} from '@app/home/edit-dialog/edit.dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatBadgeModule} from '@angular/material/badge';
import {CheckinDialog} from '@app/home/ticket-dialog/checkin.dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AppConfigService} from "@app/app-config.service";

export function loadAppConfig(configService: AppConfigService) {
  return () => configService.loadConfig();
}

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatTableResponsiveModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatBadgeModule,
    MatAutocompleteModule
  ],
  exports: [
    MatTableResponsiveModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    VariationPipe,
    EditDialog,
    CheckinDialog
  ],
    providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: loadAppConfig,
          deps: [AppConfigService],
          multi: true
        },
        { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
