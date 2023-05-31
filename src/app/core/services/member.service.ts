import { Observable } from 'rxjs';
import { LineService } from './line.service';
import { Injectable } from '@angular/core';
import { Member, memberAddress, MPLMember } from '../models/member';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PascalCasetoCamelCase } from '../pipes/pascalCasetoCamelCase';
import { CamelCaseToPascalCase } from '../pipes/camelCaseToPascalCase';
import { getContactId, getTransactionDate } from '../utils/common';

export type requstMember = {
  email: string,
  mobile: string,
  firstName: string,
  lastName: string,
  id: string | number,
};
export type requstConfirmOtp = {
  otp: string,
  phoneNumber: string,
  customerId: string | number,
};
export type RequstUpdateProfile = {
  mobile: string,
  firstName: string,
  lastName: string,
  birthdate: string,
  gender: string,
  maritalStatus: string,
  clientType: string,
  contactId: string
};

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  baseUrlMPL = `${environment.mplApi}`;
  header = environment.header;
  pascalCasetoCamelCase = new PascalCasetoCamelCase();
  camelCaseToPascalCase = new CamelCaseToPascalCase();
  member: Member;
  displayUrl: string;
  // memberMPL : MPLMember;

  constructor(private httpClient: HttpClient, private lineService: LineService) {
    // this.memberMPL = this.memberMPL;
  }

  getProfileByLineId(): Promise<MPLMember> {
    // this.lineService.initLine();
    return new Promise<MPLMember>((resolve, reject) => {
      this.lineService.getProfile().then(profile => {
        this.displayUrl = profile.pictureUrl || '';
        this.httpClient.get<MPLMember>(`${this.baseUrlMPL}/GetProfileByLine/?lineUserId=${profile.userId}`).subscribe(
          (member: MPLMember) => {
            resolve(this.pascalCasetoCamelCase.transform(member));
          }, err => reject(err));
      }).catch(e => reject(e));
    });
  }
  updateCustomerDataForLineUserId(member: requstMember): any{
    return new Promise<MPLMember>((resolve, reject) => {
      this.lineService.getProfile().then(profile => {
        const data = {
          id: member.id || 0 + '',
          lineUserId: profile.userId,
          firstNameTH: member.firstName,
          lastNameTH: member.lastName,
          userName: member.email,
          contactNumber: member.mobile,
          frontUrl: 'https://demo.foodie-delivery.com',
          brand: '3C54D1B4-CA59-4C1B-998C-6DC2FEA7238F',
        };
        this.httpClient.get<MPLMember>(`${this.baseUrlMPL}/UpdateProfile?data=${JSON.stringify(data)}`).subscribe(
          (memb) => {
            resolve(this.pascalCasetoCamelCase.transform(memb));
          }, err => reject(err));
      }).catch(e => reject(e));
    });
  }

  getCustomerByEmail(email: string): Promise<Member> {
    const body = {
      header: {
        contactId: getContactId(),
        channelId: this.header.channelId,
      } ,
      data: {
        email,
      }
    };
    return new Promise<Member>((resolve, reject) => {
        this.httpClient.post<Member>(`${environment.api}/Customer/CustomerProfileByEmail`, body).subscribe(
          (member: Member) => {
            this.member = this.pascalCasetoCamelCase.transform(member);
            localStorage.setItem('member', JSON.stringify(this.member));
            resolve(this.member);
          }, err => reject(err));
    });
  }

  registerNewCustomer( member: requstMember ): Observable<any> {
    const body = {
      header: {
        contactId: getContactId(),
        channelId: this.header.channelId,
        brandId: this.header.brandId,
        transactionId: this.header.transactionId,
        transactionDate: getTransactionDate(),
      } ,
      data: {
        email : member.email,
        mobile : member.mobile,
        firstName : member.firstName,
        lastName : member.lastName
      }
    };
    return this.httpClient.post<Member>(`${environment.api}/Register/Guest`, body);
  }

  getCustomerAddress(customerId: string | number): Promise<Array<memberAddress>> {
    const body = {
      header: {
        contactId: getContactId(),
        channelId: this.header.channelId,
        brandId: this.header.brandId,
      } ,
      data: {
        customerId,
      }
    };
    return new Promise<Array<memberAddress>>((resolve, reject) => {
      this.httpClient.post<Array<memberAddress>>(`${environment.api}/Customer/GetAddress`, body).subscribe(
        (address: Array<memberAddress>) => {
          resolve(this.pascalCasetoCamelCase.transform(address));
        }, err => reject(err));
    });
  }

  async getMember(): Promise<Member> {
    if (!localStorage.getItem('member')) {
      const profile = await this.getProfileByLineId();
      if (profile.userName){
        return await this.getCustomerByEmail(profile.userName);
      }else{
        return new Promise((resolve, reject) => {
          reject();
        });
      }
    } else {
      return new Promise((resolve, reject) => {
        const data = localStorage.getItem('member');
        this.member = data ? JSON.parse(data) : null ;
        resolve(this.member);
      });
    }
  }

  async requestOTP(email: string, phoneNumber: string): Promise<any> {
    const member: Member = await this.getCustomerByEmail(email);
    const body = {
      header: {
        contactId: getContactId(),
        channelId: this.header.channelId,
        brandId: this.header.brandId,
      } ,
      data: {
        customerId : member.integralCustomerId,
        phoneNumber,
        language: 'EN'
      }
    };
    return new Promise<Array<any>>((resolve, reject) => {
      this.httpClient.post<Array<any>>(`${environment.api}/Customer/RequestOTP`, body).subscribe(
        (otp) => {
          resolve(this.pascalCasetoCamelCase.transform(otp));
        }, err => reject(err));
    });
  }

  async confirmOTP(requstConfirm: requstConfirmOtp): Promise<any> {
    const body = {
      header: {
        contactId: getContactId(),
        channelId: this.header.channelId,
        brandId: this.header.brandId,
      } ,
      Data: requstConfirm
    };
    return new Promise<Array<any>>((resolve, reject) => {
      this.httpClient.post<Array<any>>(`${environment.api}/Customer/CheckOTP`, body).subscribe(
        (otp) => {
          resolve(this.pascalCasetoCamelCase.transform(otp));
        }, err => reject(err));
    });
  }
  updateProfile(data: RequstUpdateProfile): Promise<any>{
    const body = {
      header: {
        contactId: getContactId(),
        channelId: this.header.channelId,
        brandId: this.header.brandId,
        transactionId: this.header.transactionId,
        TransactionDate: getTransactionDate()
      } ,
      Data: {
        ...data
      }
    };
    return new Promise<Array<any>>((resolve, reject) => {
      this.httpClient.post<Array<any>>(`${environment.api}/Customer/UpdateProfileData`, body).subscribe(
        (updateProfile) => {
          resolve(this.pascalCasetoCamelCase.transform(updateProfile));
        }, err => reject(err));
    });
  }



}
