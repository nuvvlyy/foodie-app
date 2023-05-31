import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { OtpService, otpResponse } from './otp.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoadingDialogComponent } from 'src/app/layout/loading-dialog/loading-dialog.component';
import { LineService } from 'src/app/core/services/line.service';
import { LoadingDialogService } from 'src/app/layout/loading-dialog/loading-dialog.service';
import { ConfirmDialogService } from 'src/app/layout/confirm-dialog/confirm-dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {

  faChevronLeft: IconProp = faChevronLeft;

  otpInputId: string[] = [
    'first',
    'second',
    'third',
    'fourth'
  ];
  otp = new Array(4);
  modalLoading: NgbModalRef;
  isShowHeader: boolean;
  otpResponse: otpResponse;
  language = 'en';

  constructor(private location: Location, private otpService: OtpService, private route: Router,
              private loadingDialogService: LoadingDialogService, private confirmDialogService: ConfirmDialogService,
              private line: LineService, private router: Router , private translate: TranslateService) { }

  ngOnInit(): void{
    this.isShowHeader = !this.line.isInClient();
    this.otpResponse = this.otpService.otp;
    this.language = this.translate.getDefaultLang();
  }

  back(): void {
    this.router.navigateByUrl('/');
  }

  onInputEntry(event: any, idIndex: number): void {
    const value: string = event.target?.value;
    if (!value){
      if (idIndex === 0) { return; }
      const preventInput = this.otpInputId[idIndex - 1];
      return document.getElementById(preventInput)?.focus();
    }
    for (const letter of value) {
      this.otp[idIndex++] = letter.charAt(0);
      if (idIndex === 4){
        return;
      }
    }
    // this.otp[idIndex] = value.charAt(value.length - 1);
    if (idIndex === 4){
      return;
    }
    const nextInput = this.otpInputId[idIndex];
    return document.getElementById(nextInput)?.focus();
  }
  onFocus(value: any, idIndex: number): void{
    if (!value && value.length > 1){
      return ;
    }
    if (value.length > 1){
      if ((document.getElementById(this.otpInputId[idIndex])as HTMLInputElement).value) {
        (document.getElementById(this.otpInputId[idIndex]) as HTMLInputElement).value = value.charAt(0);
      }
      if (value.length >= 4){
        this.otp = value.substring(0, 4).split('');
        return document.getElementById('fourth')?.focus();
      }
      this.otp = value.split('');
      return document.getElementById(this.otpInputId[value.length])?.focus();
    }
    const nextInput = this.otpInputId[idIndex];
    return document.getElementById(nextInput)?.focus();
  }
  async confirmOtp(): Promise<boolean | void>{
    const opt: string = this.otp.map(o => o.charAt(0)).join('');
    if ( opt.length < 4){
      return this.confirmDialogService.openConfirmDialog(this.translate.instant('otp.confirmDialog.title'), this.translate.instant('otp.confirmDialog.description'), this.translate.instant('general.OK'), this.translate.instant('general.cancal'), false);
    }
    const response = await this.otpService.confirmOtp(opt);
    if (response?.data.valid) {
      return this.otpService.updateCustomerData().then(() => {
        this.route.navigateByUrl('/');
      });
    }
    if (!response?.data.valid){
      const warningMessage = response?.message.filter((m: { language: string; }) => m.language === this.language);
      return this.confirmDialogService.openConfirmDialog(warningMessage[0].title, warningMessage[0].description, this.translate.instant('general.OK'), this.translate.instant('general.cancal'), false);
    }
  }
  async resendOtp(): Promise<void>{
    this.loadingDialogService.openLoading();
    const otp = await this.otpService.requestOTP(this.otpService.memberInfo.email , this.otpService.memberInfo.mobile);
    this.loadingDialogService.closeLoading();
  }
}
