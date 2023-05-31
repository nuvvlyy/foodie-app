import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from 'src/app/layout/layout.module';
import { PromotionsService } from './promotions.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsComponent } from './promotions.component';
import { RouterModule, Routes } from '@angular/router';
import { LineService } from 'src/app/core/services/line.service';

const routes: Routes = [
  {
      path: '',
      component: PromotionsComponent,
      resolve: {
          promotion: PromotionsService
      }
  },
];
@NgModule({
  declarations: [
    PromotionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    TranslateModule
  ],
  providers: [
    PromotionsService,
    LineService
  ]
})
export class PromotionsModule { }
