import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { order, OrderHistoryService } from './order-history.service';
import { LineService } from 'src/app/core/services/line.service';
import { LandingService } from '../../landing/landing.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  orders: Array<order>;
  isShowHeader: boolean;
  tracking = false;

  constructor(private orderHistoryService: OrderHistoryService, private route: Router , private line: LineService,
              private transalate: TranslateService, private landingService: LandingService ) { }

  ngOnInit(): void {
    this.isShowHeader = !this.line.isInClient();
    this.orders = this.orderHistoryService.order.filter(o => !!o.orderNumber);
    this.tracking = this.orderHistoryService.istracking;
  }

  orderDetails(id: string): void {
    this.route.navigateByUrl(`/order/${id}`);
  }

  openStartOrderPage(): void {
    this.line.openUrl(localStorage.getItem('lineOrderOnline') || '', false);
  }
  getStatus(statusText: string): string{
    if (statusText !== 'Complete' && statusText !== 'cancelled'){
      return statusText;
    }
    return this.transalate.instant('orderHistory.' + statusText.toLowerCase());
  }

}
