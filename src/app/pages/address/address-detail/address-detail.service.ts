import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { memberAddress } from 'src/app/core/models/member';
import { AddressService } from '../address.service';

@Injectable({
  providedIn: 'root',
})
export class AddressDetailService {
  address: memberAddress | undefined;
  addressId = 'new';
  location = {
    latitude: 13.778944,
    longitude: 100.4208128,
  };
  constructor(private addressService: AddressService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    this.addressId = route.params.addressId;
    return new Promise((resolve, reject) => {
       Promise.all([
          // this.findMe(),
          this.getAddressById(this.addressId)
        ]).then(
          ([address]) => {
            this.address = address;
            resolve(true);
          },
          reject
        );
    });
  }

  findMe(): { latitude: number; longitude: number } {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        });
    }
    return {
      latitude: 13.778944,
      longitude: 100.4208128,
    };
  }

  async getAddressById(addressId: string): Promise<memberAddress | undefined> {
    let addressList = this.addressService.address;
    if (!addressList){
      addressList = await this.addressService.getCustomerAddress();
    }
    return addressId !== 'new' ? addressList?.find(
      (address) => address.id.toString() === addressId
    ) : undefined;
  }
}
