import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private modalService: NgbModal) { }

  async openConfirmDialog(title: string, description: string, confirm: string,
                          cancelLabel: string , isShowCancel: boolean = true): Promise<boolean>{
    const modalRef = this.modalService.open(ConfirmDialogComponent, {
      centered: true,
      size: 'xs',
      backdrop: 'static',
      modalDialogClass: 'confirm-dialog'
    });

    modalRef.componentInstance.description = description;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.confirm = confirm;
    modalRef.componentInstance.cancelLabel = cancelLabel;
    modalRef.componentInstance.isShowCancel = isShowCancel;

    return modalRef.result;
  }


}
