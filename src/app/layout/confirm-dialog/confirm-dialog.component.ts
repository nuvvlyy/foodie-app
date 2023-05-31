import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector   : 'layout-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent
{
    @Input() title: string;
    @Input() description: string;
    @Input() confirm: string;
    @Input() cancelLabel: string;
    @Input() isShowCancel: boolean;
    constructor(public modal: NgbActiveModal) {}

}
