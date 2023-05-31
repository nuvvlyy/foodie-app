import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from 'src/app/layout/layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderHistoryService } from './order-history/order-history.service';
import { OrderDetailsService } from './order-details/order-details.service';
import { LineService } from 'src/app/core/services/line.service';


const routes: Routes = [
  {
      path: '',
      component: OrderHistoryComponent,
      resolve: {
          order: OrderHistoryService
      }
  },
  {
      path: ':orderId',
      component: OrderDetailsComponent,
      resolve: {
        order: OrderDetailsService
      },
      data: {
        title: 'Order Details'
      }
  },
];
@NgModule({
  declarations: [
    OrderHistoryComponent,
    OrderDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,

    FontAwesomeModule,
    LayoutModule,
  ],
  providers: [
    OrderHistoryService,
    OrderDetailsService,
    LineService
  ]
})
export class OrderModule { }
