import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { memberAddress } from 'src/app/core/models/member';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoadingDialogComponent } from 'src/app/layout/loading-dialog/loading-dialog.component';
import { LineService } from 'src/app/core/services/line.service';
import { ConfirmDialogComponent } from 'src/app/layout/confirm-dialog/confirm-dialog.component';
import { AddressService } from '../address.service';
import { ConfirmDialogService } from 'src/app/layout/confirm-dialog/confirm-dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  faTrashAlt: IconProp = faTrashAlt;
  faChevronRight: IconProp = faChevronRight;
  modalLoading: NgbModalRef;
  addressData: Array<memberAddress>;
  isShowHeader: boolean;
  status = 0;

  constructor(private addressService: AddressService, private route: Router , private modalService: NgbModal, private line: LineService,
              private confirmDialogService: ConfirmDialogService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.isShowHeader = !this.line.isInClient();
    this.addressData = this.addressService.address;

  }

  addNewAddress(): void {
    this.route.navigateByUrl(`/address/new`);
  }

  editAddress(id: string | number): void {
    this.route.navigateByUrl(`/address/${id}`);
  }

  openLoading(): void {
    this.modalLoading = this.modalService.open(LoadingDialogComponent, {
      centered: true,
      size: 'xs',
      modalDialogClass : 'modal-loading',
      backdrop: 'static'
    });
  }

  closeLoading(): void {
    this.modalLoading.close();
  }

  async remove(addressId: number | number ): Promise<void>{
    const confrim = await this.confirmDialogService.openConfirmDialog(this.translate.instant('address.deleteAddress'),
                    this.translate.instant('address.deleteAddressDescription'), this.translate.instant('general.no'),
                    this.translate.instant('general.yes'));
    if (!confrim){
      const remove = await this.addressService.removeAddress(addressId);
      if (remove){
        this.addressData = await this.addressService.getCustomerAddress();
      }
    }
  }
  handelRadio(index: number): void{
    this.status = index;
  }

}
