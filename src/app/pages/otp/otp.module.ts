import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { LayoutModule } from 'src/app/layout/layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpComponent } from './otp.component';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CoreModule } from 'src/app/core/core.module';
import { DirectivesModule } from 'src/app/core/directives/directive';
import { OtpService } from './otp.service';

const routes: Routes = [
  {
      path: '',
      component: OtpComponent,
      resolve: {
          otp: OtpService
      }
  }
];
@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FontAwesomeModule,
    DirectivesModule,
    FormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ],
  declarations: [OtpComponent],
  providers: [
    OtpService
  ]
})
export class OtpModule { }
