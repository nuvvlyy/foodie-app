import { MemberService, requstConfirmOtp, requstMember } from './../../core/services/member.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

export type otpResponse = {
  customerId: number;
  phoneNumber: string;
  reference: string;
  requestDate: Date;
  validToDate: Date;
};

@Injectable({providedIn: 'root'})

export class OtpService implements Resolve<any>  {

  otp: otpResponse;
  phoneNumber: string;
  memberInfo: requstMember;
  constructor(private httpClient: HttpClient, private router: Router, private memberService: MemberService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const navigation = this.router.getCurrentNavigation();
    const data = navigation?.extras.state || null;
    if (data == null){
      this.router.navigateByUrl('/');
    }
    return new Promise((resolve, reject) => {
      Promise.all([
        this.requestOTP(data?.memberInfo.email, data?.memberInfo.mobile),
      ]).then(
        ([requestOTP]) => {
          this.otp = requestOTP;
          this.phoneNumber = data?.memberInfo.mobile;
          this.memberInfo = {
            email : data?.memberInfo.email,
            id: data?.memberInfo.id,
            firstName: data?.memberInfo.firstName,
            lastName: data?.memberInfo.lastName,
            mobile : data?.memberInfo.mobile,
          },
          // this.order = this.pascalCasetoCamelCase.transform(order);
          resolve(true);
        },
        reject
      );
    });
  }

  async requestOTP(email: string , phoneNumber: string): Promise<otpResponse> {
    const otp = await this.memberService.requestOTP(email, phoneNumber);
    return otp.data as unknown as otpResponse;
  }

  confirmOtp(otp: string): Promise<any> {
    const data: requstConfirmOtp = {
      customerId : this.otp.customerId,
      otp,
      phoneNumber: this.phoneNumber
    };
    return this.memberService.confirmOTP(data);
  }
  updateCustomerData(): any{
    return this.memberService.updateCustomerDataForLineUserId(this.memberInfo);
  }
}
