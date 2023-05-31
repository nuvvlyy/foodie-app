import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'layout-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.scss']
})
export class LoadingDialogComponent {

  constructor(public modal: NgbActiveModal) {
  }
}
