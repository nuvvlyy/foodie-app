import { LoadingDialogService } from './../../../layout/loading-dialog/loading-dialog.service';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft, faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { AddressService, memberAddressRequst } from '../address.service';
import { catchError, map } from 'rxjs/operators';
import { AddressDetailService } from './address-detail.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoadingDialogComponent } from 'src/app/layout/loading-dialog/loading-dialog.component';
import { LineService } from 'src/app/core/services/line.service';
import { PlatformLocation } from '@angular/common';
import { ConfirmDialogService } from 'src/app/layout/confirm-dialog/confirm-dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-address-detail',
  templateUrl: './address-detail.component.html',
  styleUrls: ['./address-detail.component.scss'],
})
export class AddressDetailComponent implements OnInit, AfterViewInit{
  faChevronLeft: IconProp = faChevronLeft;
  faSearch: IconProp = faSearch;
  faTimesCircle: IconProp = faTimesCircle;
  locationCoords: {
    latitude: number;
    longitude: number;
  };
  search: string;
  apiLoaded: Observable<boolean>;
  options: google.maps.MapOptions;
  locations: Observable<object>;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPosition: google.maps.LatLngLiteral = {
    lng: 100.4208128,
    lat: 13.778944,
  };
  geocoder: google.maps.Geocoder;
  place: google.maps.places.AutocompleteService;
  autocomplete: google.maps.places.Autocomplete;
  @ViewChild('addressText', { static: true, read: ElementRef })
  addressText: ElementRef;

  address: google.maps.GeocoderAddressComponent[] | undefined = undefined;
  latLng: google.maps.LatLngLiteral;
  houseNo: string;
  note: string;
  myPosition = {
    lng: 100.4208128,
    lat: 13.778944,
  };
  modalLoading: NgbModalRef;
  isShowHeader: boolean;

  constructor(
    private httpClient: HttpClient,
    private location: Location,
    private addressService: AddressService,
    private addressDetailService: AddressDetailService,
    private route: Router,
    private modalService: NgbModal,
    private line: LineService,
    private loadingDialogService: LoadingDialogService,
    private confirmDialogService: ConfirmDialogService,
    private translate: TranslateService,
    private platformLocation: PlatformLocation) {
    this.platformLocation.onPopState(() => {
      this.loadingDialogService.closeLoading();
    });
    }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.isShowHeader = !this.line.isInClient();
    const address = this.addressDetailService.address;

    navigator.geolocation.getCurrentPosition((p) => {
      this.myPosition = {
        lat: Number(p.coords.latitude),
        lng: Number(p.coords.longitude),
      };
    }, async (err) => {
      const confrim = await this.confirmDialogService.openConfirmDialog(this.translate.instant('address.allowLocation'),
                    '', this.translate.instant('general.OK'),
                    this.translate.instant('general.no'), false);
      if (!confrim || confrim){
        this.route.navigateByUrl(`/address`);
      }
    });

    this.apiLoaded = this.httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?address=Thailand&key=${environment.mapKey}&libraries=places&types=establishment|address`,
        'callback'
      )
      .pipe(
        map(() => {
          this.geocoder = new google.maps.Geocoder();
          if (address) {
            this.options = {
              mapTypeId : 'terrain',
              streetViewControl: false,
              disableDefaultUI: true,
              center: {
                lat: parseFloat(`${address.latitude}`),
                lng: parseFloat(`${address.longtitude}`),
              },
            };
            const position = new google.maps.LatLng(+address.latitude, +address.longtitude);
            this.setAddressBylatLng(position);
            this.houseNo = address.houseNo;
            this.note = address.note;
            this.markerPosition = this.options.center as google.maps.LatLngLiteral;
          } else {
            this.options = {
              mapTypeId: 'terrain',
              streetViewControl: false,
              disableDefaultUI: true,
              center: this.myPosition,
            };
          }
          const options = {
            types: [],
            componentRestrictions: {country: 'th'}
           };
          this.autocomplete = new google.maps.places.Autocomplete(
            this.addressText.nativeElement, options
          );
          this.autocomplete.addListener('place_changed', () => {
            const place: google.maps.places.PlaceResult =
            this.autocomplete.getPlace();
            this.loadingDialogService.openLoading();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.address = place?.address_components;
            const houseNo = this.address?.find(
              (data: google.maps.GeocoderAddressComponent) =>
                data.types.findIndex(
                  (type) => type === 'street_number'
                ) !== -1
            )?.long_name || '';
            const soi = this.address?.find(
              (data: google.maps.GeocoderAddressComponent) =>
                data.types.findIndex(
                  (type) => type === 'route'
                ) !== -1 && (data.long_name.toString().includes('ซอย') || data.long_name.toString().includes('Alley'))
            )?.long_name || this.address?.find(
              (data: google.maps.GeocoderAddressComponent) =>
                data.types.findIndex(
                  (type) => type === 'route') !== -1
            )?.long_name || '';
            this.houseNo = houseNo || '';
            this.latLng = {
              lng: place.geometry.location.lng(),
              lat: place.geometry.location.lat(),
            } as unknown as google.maps.LatLngLiteral;
            this.onSearch();
            this.loadingDialogService.closeLoading();
            return true;
          });
          return true;
        }),
        catchError((error) => {
          return of(false);
        })
      );
  }

  back(): void {
    this.location.back();
  }

  clear(): void {
    this.addressText.nativeElement.value = '';
    this.autocomplete.getPlace();
  }

  setMarker(e: any): void {
    const position = {
      lng: parseFloat(e?.latLng?.lng()),
      lat: parseFloat(e?.latLng?.lat()),
    } as unknown as google.maps.LatLngLiteral;
    this.geocoder.geocode({ location: position }, (results, status) => {
      if (status === 'OK') {
        this.address = results[0]?.address_components;
        const houseNo = this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex(
              (type) => type === 'street_number'
            ) !== -1
        )?.long_name || '';
        const soi = this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex(
              (type) => type === 'route'
            ) !== -1 && (data.long_name.toString().includes('ซอย') || data.long_name.toString().includes('Alley'))
        )?.long_name || this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex(
              (type) => type === 'route') !== -1
        )?.long_name || '';
        this.houseNo = houseNo || '';
        this.latLng = {
          lng: results[0]?.geometry.location.lng(),
          lat: results[0]?.geometry.location.lat(),
        } as unknown as google.maps.LatLngLiteral;
      }
    });
    this.markerPosition = position;
  }

  onSearch(): void {
    this.markerPosition = this.latLng;
    this.options = {
      mapTypeId: 'terrain',
      streetViewControl: false,
      center: this.latLng,
    };
  }

  async onSave(): Promise<void> {
    this.loadingDialogService.openLoading();
    const address: memberAddressRequst = {
      id: Number(this.addressDetailService.addressId) || 0 ,
      customerId: '',
      buildingTypeId: 2,
      houseNo: this.houseNo,
      roadName:
        this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex((type) => type === 'route') !== -1
        )?.long_name || '',
      district:
        this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex(
              (type) => type === 'administrative_area_level_2'
            ) !== -1
        )?.long_name ||
        this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex((type) => type === 'sublocality_level_1') !==
            -1
        )?.long_name ||
        '',
      subDistrict:
        this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex((type) => type === 'sublocality_level_2') !==
            -1
        )?.long_name ||
        this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex((type) => type === 'sublocality_level_1') !==
            -1
        )?.long_name ||
        '',
      province:
        this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex(
              (type) => type === 'administrative_area_level_1'
            ) !== -1
        )?.long_name || '',
      postalCode:
        this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex((type) => type === 'postal_code') !== -1
        )?.long_name || '',
      note: this.note,
      latitude: this.latLng.lat,
      longtitude: this.latLng.lng,
    };
    const isUpdate = await this.addressService.addNewAddress(address);
    this.loadingDialogService.closeLoading();
    if (isUpdate) {
      this.route.navigateByUrl(`/address`);
    }
  }
  setAddressBylatLng(latLng: google.maps.LatLng): void{
    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        this.address = results[0]?.address_components;
        const houseNo = this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex(
              (type) => type === 'street_number'
            ) !== -1
        )?.long_name || '';
        const soi = this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex(
              (type) => type === 'route'
            ) !== -1 && (data.long_name.toString().includes('ซอย') || data.long_name.toString().includes('Alley'))
        )?.long_name || this.address?.find(
          (data: google.maps.GeocoderAddressComponent) =>
            data.types.findIndex(
              (type) => type === 'route') !== -1
        )?.long_name || '';
        this.houseNo = houseNo || '';
        this.latLng = {
          lng: results[0]?.geometry.location.lng(),
          lat: results[0]?.geometry.location.lat(),
        } as unknown as google.maps.LatLngLiteral;
      }
    });
  }

  getCurrentLocation(): void{
    this.loadingDialogService.openLoading();
    navigator.geolocation.getCurrentPosition((p) => {
      this.loadingDialogService.closeLoading();
      this.options = {
        mapTypeId: 'terrain',
        streetViewControl: false,
        disableDefaultUI: true,
        center: {
          lat: parseFloat(`${p.coords.latitude}`),
          lng: parseFloat(`${p.coords.longitude}`),
        },
      };
      const position = new google.maps.LatLng(+p.coords.latitude, + p.coords.longitude);
      this.setAddressBylatLng(position);
      this.markerPosition = this.options.center as google.maps.LatLngLiteral;
      this.clear();
    }, async (err) => {
      this.loadingDialogService.closeLoading();
      const confrim = await this.confirmDialogService.openConfirmDialog(this.translate.instant('address.allowLocation'),
                    '', this.translate.instant('general.OK'),
                    this.translate.instant('general.no'), false);
      if (!confrim || confrim){
        this.route.navigateByUrl(`/address`);
      }
    });
  }
}
