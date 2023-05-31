import { MemberService } from './../../core/services/member.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Member } from 'src/app/core/models/member';
import { order, OrderHistoryService } from '../order/order-history/order-history.service';
import { PascalCasetoCamelCase } from 'src/app/core/pipes/pascalCasetoCamelCase';

@Injectable({
  providedIn: 'root'
})
export class MembershipService implements Resolve<any>{

  member: Member;
  orderHistory: Array<order>;
  pascalCasetoCamelCase = new PascalCasetoCamelCase();

  constructor(private memberService: MemberService, private orderHistoryService: OrderHistoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.memberService.getMember(),
        this.orderHistoryService.getOrderByCustomerId()
        // this.getProduct().toPromise()
      ]).then(
        ([member, orderHistory]) => {
          this.member = this.pascalCasetoCamelCase.transform(member);
          this.orderHistory = this.pascalCasetoCamelCase.transform(orderHistory);
          resolve(true);
        },
        reject
      );
    });
  }
}
