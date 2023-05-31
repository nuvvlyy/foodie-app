import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LineService } from 'src/app/core/services/line.service';
import { order } from '../order-history/order-history.service';
import { OrderDetailsService } from './order-details.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingDialogService } from 'src/app/layout/loading-dialog/loading-dialog.service';
import { PascalCasetoCamelCase } from 'src/app/core/pipes/pascalCasetoCamelCase';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderDetails: order;
  isShowHeader: boolean;
  pascalCasetoCamelCase = new PascalCasetoCamelCase();

  constructor(private orderDetailsService: OrderDetailsService, private line: LineService, private titleService: Title,
              private transalate: TranslateService,private loadingDialogService: LoadingDialogService) { }

  ngOnInit(): void {
    this.orderDetails = this.orderDetailsService.order;
    this.titleService.setTitle( this.transalate.instant('orderHistory.orderDetails') + ' - ' + this.orderDetails.orderNumber);
    this.isShowHeader = !this.line.isInClient();
  }

  openLogisticTrackingPage(logisticTracking: string | null): void{
    if (logisticTracking){
      this.line.openUrl(logisticTracking, false);
    }
  }
  async refresh(): Promise<void> {
    this.loadingDialogService.openLoading();
    this.orderDetails = this.pascalCasetoCamelCase.transform(await this.orderDetailsService.getOrderById(this.orderDetails.id));
    this.loadingDialogService.closeLoading();
  }
}
