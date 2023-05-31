import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoadingDialogComponent } from './loading-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingDialogService {

  modalLoading: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  openLoading(): void {
    this.modalLoading = this.modalService.open(LoadingDialogComponent, {
      centered: true,
      size: 'xs',
      modalDialogClass : 'modal-loading',
      backdrop: 'static'
    });
  }
  closeLoading(): void {
    if (this.modalLoading) {
    this.modalLoading.close();
    }
  }
}

