import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { ButtonBackComponent } from './button-back/button-back.component';
import {RouterModule} from '@angular/router';
@NgModule({
  declarations: [
    ConfirmDialogComponent,
    LoadingDialogComponent,
    HeaderComponent,
    ButtonBackComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbModule,
    TranslateModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    LoadingDialogComponent,
    ConfirmDialogComponent,
    ButtonBackComponent
  ],

})
export class LayoutModule { }
