import { MemberService } from './../../core/services/member.service';
import { Member } from './../../core/models/member';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PascalCasetoCamelCase } from 'src/app/core/pipes/pascalCasetoCamelCase';
import { HttpClient } from '@angular/common/http';
import { LineService, TokenResponse } from 'src/app/core/services/line.service';
import * as moment from 'moment';
import { getContactId } from 'src/app/core/utils/common';

export type LMOA = {
  storeName: string,
  endpoint: string,
  brandId: string,
  merchantId: string,
  brandToken: string,
  lINEOrderOnline: string,
  lINEUpdateProfile: string,
  channelID: string,
  channelSecret: string,
  colorCode: string,
  sendLINENotifyDelivery: boolean,
  sendLINENotifyPickup: boolean,
  sendLINENotifyOrderReview: boolean,
  sendLINENotifyThankYou: boolean
};

export type BannerInfo = {
  bannerPath: string,
  displayDuration: string,
  endDate: string,
  href: string,
  id: string,
  isActive: boolean
  ranking: string
  startDate: string
};

export type OperatingTime = {
  breakEndTime1: string,
  breakEndTime2: string,
  breakStartTime1: string,
  breakStartTime2: string,
  day: string,
  endTime: string,
  isClosed: boolean,
  lastOrderTime: string,
  startTime: string,
};

export type BrendInfo = {
  addressLine1: string,
  addressLine2: string,
  brandLogo: string,
  brandNameEN: string,
  brandNameJP: string,
  brandNameShort: string,
  brandNameTH: string,
  channel: number,
  companyName: string,
  contactId: string,
  copyCaption: string,
  deliveryFee: number
  email: string,
  footerTextLine1: string,
  footerTextLine2: string,
  headerWelcomeText: string,
  id: number,
  isActive: boolean
  isOffline: boolean
  kitchenTicketCaption: string,
  kmlFile1: string,
  kmlFile2: string,
  kmlFile3: string,
  minimumCart: number
  offlineMessageEN: string,
  offlineMessageTH: string,
  openingDate: string,
  operatingTime: OperatingTime,
  orderCode: string,
  orderCodeBC: string,
  orderCodeOffline: string,
  orderTicketCaption: string,
  originalCaption: string,
  taxID: string,
  telephone: string,
  token: string,
  updateBy: string,
  updateOn: string,
  uATInclude: boolean
  uatDeliveryFee: boolean
};

@Injectable({
  providedIn: 'root'
})
export class LandingService implements Resolve<any> {

  header = environment.header;
  baseUrl = `${environment.api}`;
  foodieApi = `${environment.foodieApi}`;
  pascalCasetoCamelCase = new PascalCasetoCamelCase();
  brendInfo: BrendInfo;
  banners: Array<BannerInfo>;
  currentTime: string;
  lmoa: LMOA;
  followers: number;
  member: Member;

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const token = await route.queryParams.token || localStorage.getItem('token')  || '';
    localStorage.setItem('token', token);
    return new Promise((resolve, reject) => {
      this.getLMOA(token).then(lmoa => {
        this.lmoa = lmoa;
        environment.api = `https://${lmoa.endpoint}/api`;
        environment.header.contactId = lmoa.merchantId;
        environment.header.brandId = Number(lmoa.brandId);
        localStorage.setItem('contactId', lmoa.merchantId || '');
        localStorage.setItem('lineOrderOnline', lmoa.lINEOrderOnline || '');
        this.baseUrl = environment.api;
        Promise.all([
          this.getBrandInformation(),
          this.getBanners(),
          this.getCurrentTime(),
          this.getCustomerProfile()
        ]).then(
          ([brendInfo, banners, currentTime, member]) => {
            localStorage.setItem('color', lmoa.colorCode);
            this.brendInfo = brendInfo;
            this.banners = banners;
            this.currentTime = currentTime;
            this.member = member;
            resolve(true);
          },
          reject
        );
      });
    });
  }
  constructor(private httpClient: HttpClient, private memberService: MemberService, private line: LineService) { }

  async getBanners(): Promise<Array<BannerInfo>> {
    const body = {
      header: {
        contactId: getContactId(),
        channelId: this.header.channelId,
        brandId: this.header.brandId
      },
      data: {
        type: '2'
      }
    };
    return new Promise<Array<BannerInfo>>((resolve, reject) => {
      this.httpClient.post<Array<BannerInfo>>(`${this.baseUrl}/Banner/Brand/GetAll`, body).subscribe(
        (banners: Array<BannerInfo>) => {
          resolve(this.pascalCasetoCamelCase.transform(banners));
        }, err => reject(err));
    });
  }

  async getBrandInformation(): Promise<BrendInfo> {
    const body = {
      header: {
        contactId: getContactId(),
        channelId: this.header.channelId,
      },
      data: {
        id: this.header.brandId,
        branchId: '0'
      }
    };
    return new Promise<BrendInfo>((resolve, reject) => {
      this.httpClient.post<BrendInfo>(`${this.baseUrl}/BrandSetting/GetBrandInfo`, body).subscribe(
        (brendInfo: BrendInfo) => {
          resolve(this.pascalCasetoCamelCase.transform(brendInfo));
        }, err => reject(err));
    });
  }

  async getCurrentTime(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.httpClient.get<any>(`${this.baseUrl}/Foodie/GetCurrentTime`).subscribe(
        (timeNow: any) => {
          resolve(this.pascalCasetoCamelCase.transform(timeNow).timeNow);
        }, err => reject(err));
    });
  }

  async getLMOA(token: string): Promise<LMOA> {
    const body = new FormData();
    body.append('token', token);
    body.append('Passphrase', environment.passphrase);
    return new Promise<LMOA>((resolve, reject) => {
      this.httpClient.post<LMOA>(`${this.foodieApi}/FoodieStoreSetups/GetLMOASetup`, body)
      .subscribe((data: LMOA) => {
          resolve(this.pascalCasetoCamelCase.transform(data));
        }, err => reject(err));
    });
  }

  async getCustomerProfile(): Promise<Member> {
    const profile = await this.memberService.getProfileByLineId();
    if (profile.userName === null) {
      const member = {
        firstNameEN: null,
        fastNameEN: null,
        phoneNumber: null,
        email: null,
        id: null
      } as unknown as Member;
      return Promise.resolve(member);
    }
    return this.memberService.getCustomerByEmail(profile.userName);
  }
}
