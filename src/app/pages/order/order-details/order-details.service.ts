import { Observable } from 'rxjs';
import { MemberService } from './../../../core/services/member.service';
import { HttpClient } from '@angular/common/http';
import { order } from './../order-history/order-history.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PascalCasetoCamelCase } from 'src/app/core/pipes/pascalCasetoCamelCase';
import { getContactId } from 'src/app/core/utils/common';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService implements Resolve<any>  {

  baseUrl = `${environment.api}`;
  header = environment.header;
  order: order;
  pascalCasetoCamelCase = new PascalCasetoCamelCase();

  constructor(private httpClient: HttpClient, private memberService: MemberService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const orderId = route.params.orderId;
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getOrderById(orderId),
        // this.getProduct().toPromise()
      ]).then(
        ([o]) => {
          this.order = this.pascalCasetoCamelCase.transform(o);
          resolve(true);
        },
        reject
      );
    });
  }

  async getOrderById(orderId: string): Promise<order> {
    const body = {
      Header: {
        contactId: getContactId(),
        channelId: this.header.channelId,
        brandId: this.header.brandId
      },
      Data: {
        id : orderId
      }
    };
    return this.httpClient.post<order>(`${this.baseUrl}/Order/GetById`, body).toPromise();
  }
}
