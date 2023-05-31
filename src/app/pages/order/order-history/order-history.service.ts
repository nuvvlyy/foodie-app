import { Member } from 'src/app/core/models/member';
import { MemberService } from './../../../core/services/member.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PascalCasetoCamelCase } from 'src/app/core/pipes/pascalCasetoCamelCase';
import { getContactId } from 'src/app/core/utils/common';
// import { type } from 'os';

export type order = {
  id: string,
  orderNumber: string,
  orderBy: string,
  orderDate: Date,
  customerId: number,
  customerName: string,
  contactNumber: string,
  customerEmail: string,
  customerLat: string,
  customerLng: string,
  branchLat: string,
  branchLng: string,
  totalQty: number,
  totalQtyAfterPro: number,
  totalAmount: number,
  totalAmountAfterPro: number,
  orderDiscount: number,
  deliveryFee: number,
  subTotal: number,
  vat: number,
  totalPay: number,
  couponCode: string,
  couponAmount: string,
  voucherCode: string,
  voucherAmount: string,
  netAmount: string,
  amountReceived: string,
  amountChange: number,
  messengerId: string,
  messengerName: string,
  deliveryType: number,
  deliveryDate: Date,
  deliveryTime: string,
  estimatedDispatchTime: Date,
  deliveryAddressId: number,
  deliveryAddressText: string,
  deliveryAddressNote: string,
  billingAddressId: string,
  billingAddressText: string,
  branchId: number,
  branchName: string,
  branchOrderNumber: string,
  status: number,
  statusText: string,
  paymode: number,
  saymodeText: number,
  paymentStatus: string,
  saymentNumber: string,
  isRequireTaxInvoice: boolean,
  isFutureDelivery: boolean,
  isFutureConfirm: string,
  isPhoneOrder: boolean,
  isCcConfirm: boolean,
  isBranchConfirm: true,
  isCook: string,
  isDelivery: string,
  isComplete: string,
  isCancel: string,
  isDraft: string,
  cookingOn: string,
  deliveryOn: string,
  completeTime: string,
  completeOn: string,
  orderDetails: string,
  orderPromotions: string,
  createdBy: string,
  createdOn: Date,
  modifiedBy: string,
  modifiedOn: Date,
  orderRemarks: number,
  completeRemark: string,
  cancelReason: string,
  complaintReason: string,
  resetOrder: string,
  rePrint: string,
  thirdPartyOrderId: string,
  kitchenPrint: string,
  messengerPrint: string,
  printStatus: string,
  rctStatus: string,
  brandId: number,
  brand: string,
  invoiceNo: string,
  orderTimes: number,
  taxId: string,
  totalPointsEarned: number,
  memberCardNumber: string,
  pickupAtBranch: boolean,
  logisticBy: string,
  logisticRef: string,
  logisticTracking: string,
  logisticOrderId: string,
  logisticDeliveryFee: string,
  logisticRequestDate: string,
  logisticDriverName: string,
  logisticDriverPhone: string,
  logisticStatus: string,
  brandLogo: string,
  cashRemark: string,
  distance: string,
  reference: string
};

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService implements Resolve<any>  {

  baseUrl = `${environment.api}`;
  header = environment.header;
  order: Array<order>;
  pascalCasetoCamelCase = new PascalCasetoCamelCase();
  istracking = false;

  constructor(private httpClient: HttpClient, private memberService: MemberService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    this.istracking = false;
    const params = await route.queryParams;
    if ( params.istracking){
      this.istracking = params.istracking;
    }
    return new Promise((resolve, reject) => {
      Promise.all([
        this.istracking ? this.getOrderStatusTrackingByCustomerId() : this.getOrderByCustomerId(),
        // this.getProduct().toPromise()
      ]).then(
        ([orders]) => {
          this.order = this.pascalCasetoCamelCase.transform(orders);
          resolve(true);
        },
        reject
      );
    });
  }
  async getOrderByCustomerId(): Promise<order[]> {
    const member: Member = await this.memberService.getMember();
    const body = {
      Header: {
        contactId: getContactId(),
        channelId: this.header.channelId,
        brandId: this.header.brandId
      },
      Data: {
        customerId : member.id
      }
    };
    return this.httpClient.post<Array<order>>(`${this.baseUrl}/Order/GetByCustomer`, body).toPromise();
  }

  async getOrderStatusTrackingByCustomerId(): Promise<order[]> {
    const member: Member = await this.memberService.getMember();
    const body = {
      Header: {
        contactId: getContactId(),
        channelId: this.header.channelId,
        brandId: this.header.brandId
      },
      Data: {
        customerId : member.id
      }
    };
    return this.httpClient.post<Array<order>>(`${this.baseUrl}/Order/GetByCustomerTracking`, body).toPromise();
  }
}
