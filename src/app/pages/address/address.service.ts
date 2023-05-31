import { HttpClient } from '@angular/common/http';
import { MemberService } from './../../core/services/member.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CamelCaseToPascalCase } from 'src/app/core/pipes/camelCaseToPascalCase';
import { PascalCasetoCamelCase } from 'src/app/core/pipes/pascalCasetoCamelCase';
import { environment } from 'src/environments/environment';
import { Member, memberAddress } from 'src/app/core/models/member';
import { getContactId } from 'src/app/core/utils/common';

export type memberAddressRequst = {
  id: number, // 0 = new address | or address id = edit
  customerId: string,
  buildingTypeId: number,
  houseNo: string,
  roadName: string,
  district: string,
  subDistrict: string,
  province: string,
  postalCode: string,
  note: string,
  latitude: number,
  longtitude: number,
};
@Injectable({
  providedIn: 'root'
})
export class AddressService implements Resolve<any>  {

  baseUrlMPL = `${environment.mplApi}`;
  baseUrl = `${environment.api}`;
  header = environment.header;
  pascalCasetoCamelCase = new PascalCasetoCamelCase();
  camelCaseToPascalCase = new CamelCaseToPascalCase();
  address: Array<memberAddress>;
  location: {
    latitude: number,
    longitude: number
  };

  constructor(private memberService: MemberService, private httpClient: HttpClient) {}


   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getCustomerAddress()
        // this.getProduct().toPromise()
      ]).then(
        ([address]) => {
          this.address = address;
          resolve(true);
        },
        reject
      );
    });
  }
  async getCustomerAddress(): Promise<Array<memberAddress>>{
    const member: Member = await this.memberService.getMember();
    return this.memberService.getCustomerAddress(member.id);
  }

  async addNewAddress(addressRequst: memberAddressRequst): Promise<Array<memberAddress>> {
    const member: Member = await this.memberService.getMember();
    addressRequst.customerId = member.id.toString();
    const body = {
      header: {
        contactId: getContactId(),
        channelId: this.memberService.header.channelId,
      } ,
      data: addressRequst
    };
    return new Promise<Array<memberAddress>>((resolve, reject) => {
      this.httpClient.post<Array<memberAddress>>(`${this.baseUrl}/Customer/SaveAddress`, body).subscribe(
        (address: Array<memberAddress>) => {
          resolve(this.pascalCasetoCamelCase.transform(address));
        }, err => reject(err));
    });
  }
  async removeAddress(addressId: string | number): Promise<Array<memberAddress>> {
    const member: Member = await this.memberService.getMember();
    const body = {
      header: {
        contactId: getContactId(),
        channelId: this.memberService.header.channelId,
      } ,
      data: {
        id: addressId,
        customerId: member.id.toString()
      }
    };
    return new Promise<Array<memberAddress>>((resolve, reject) => {
      this.httpClient.post<Array<memberAddress>>(`${this.baseUrl}/Customer/RemoveAddress`, body).subscribe(
        (address: Array<memberAddress>) => {
          resolve(this.pascalCasetoCamelCase.transform(address));
        }, err => reject(err));
    });
  }

}
