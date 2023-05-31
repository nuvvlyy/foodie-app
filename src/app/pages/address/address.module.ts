import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { AddressDetailService } from './address-detail/address-detail.service';
import { LayoutModule } from 'src/app/layout/layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddressDetailComponent } from './address-detail/address-detail.component';
import { AddressService } from './address.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { AddressesComponent } from './addresses/addresses.component';


const routes: Routes = [
  {
      path: '',
      component: AddressesComponent,
      resolve: {
          chat: AddressService
      }
  },
  {
    path: ':addressId',
    component: AddressDetailComponent,
    resolve: {
      AddressDetailService
    }
  }
];
@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    LayoutModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    TranslateModule,
    RouterModule.forChild(routes),

  ],
  declarations: [ AddressDetailComponent, AddressesComponent],
  providers: [
    AddressDetailService,
    AddressService,
  ]
})
export class AddressModule { }
