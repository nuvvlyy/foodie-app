import { MemberService } from './../../core/services/member.service';
import { Member } from './../../core/models/member';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PascalCasetoCamelCase } from 'src/app/core/pipes/pascalCasetoCamelCase';
import { getContactId } from 'src/app/core/utils/common';

export type Promotion = {
  description: string,
  descriptionJP: string,
  descriptionTH: string,
  endDate: Date,
  endTime: string,
  id: number,
  image: string,
  startDate: Date,
  startTime: string,
  title: string,
  titleJP: string,
  titleTH: string,
};
@Injectable({
  providedIn: 'root'
})
export class PromotionsService implements Resolve<any> {

  promotion: any;
  baseUrl = `${environment.api}`;
  pascalCasetoCamelCase = new PascalCasetoCamelCase();

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getPromotion(),
        // this.getProduct().toPromise()
      ]).then(
        ([promotion]) => {
          this.promotion = promotion;
          resolve(true);
        },
        reject
      );
    });
  }

  constructor(private httpClient: HttpClient , private memberService: MemberService) { }

  async getPromotion(): Promise<Array<Promotion>>{
    const member: Member = await this.memberService.getMember();
    const body = {
      header: {
        contactId: getContactId(),
        channelId: this.memberService.header.channelId,
        brandId: this.memberService.header.brandId,
      } ,
      data: {
        customerId : member.id,
      }
    };
    return new Promise<Array<Promotion>>((resolve, reject) => {
    this.httpClient.post<Array<Promotion>>(`${this.baseUrl}/Promotion/GetAll`, body).subscribe(
      (promotions: Array<Promotion>) => {
        resolve(this.pascalCasetoCamelCase.transform(promotions));
      }, err => reject(err));
    });
}
}
