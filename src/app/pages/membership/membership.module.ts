import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MembershipService } from './membership.service';
import { LayoutModule } from 'src/app/layout/layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipComponent } from './membership.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
      path: '',
      component: MembershipComponent,
      resolve: {
          member: MembershipService
      }
  },
];
@NgModule({
  declarations: [
    MembershipComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    TranslateModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  providers: [
    MembershipService
  ]
})
export class MembershipModule { }
