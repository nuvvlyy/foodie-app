import { MemberService } from './../../../../core/services/member.service';
import { Router } from '@angular/router';
import { ProfileService } from './../../profile.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { requstMember } from 'src/app/core/services/member.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PascalCasetoCamelCase } from 'src/app/core/pipes/pascalCasetoCamelCase';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/layout/confirm-dialog/confirm-dialog.component';
import { LoadingDialogComponent } from 'src/app/layout/loading-dialog/loading-dialog.component';
import { LoadingDialogService } from 'src/app/layout/loading-dialog/loading-dialog.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit , OnDestroy{

  memberInfo: requstMember;
  public subscribe: Subject<any>;
  memberInfoFrom: FormGroup;
  isFormSubmit = false;
  pascalCasetoCamelCase = new PascalCasetoCamelCase();
  modalLoading: NgbModalRef;

  constructor(private profileService: ProfileService, private route: Router, private memberService: MemberService,
              private loadingDialogService: LoadingDialogService) {
    this.subscribe = new Subject();
  }

  ngOnDestroy(): void {
    this.subscribe.next(true);
    this.subscribe.complete();
  }

  ngOnInit(): void{
    this.memberInfo = {
      id: this.profileService.profile?.integralCustomerId || '',
      email : this.profileService.profile?.email as string || '',
      mobile : this.profileService.profile?.phoneNumber as string || '',
      firstName : this.profileService.profile?.firstNameTH as string || '',
      lastName : this.profileService.profile?.lastNameTH as string || '',
    };
    this.memberInfoFrom = new FormGroup({
      firstName: new FormControl(this.memberInfo.firstName, [
        Validators.required,
      ]),
      email: new FormControl(this.memberInfo.email, [
        Validators.email, Validators.required
      ]),
      mobile: new FormControl(this.memberInfo.mobile, Validators.required),
      lastName: new FormControl(this.memberInfo.lastName, Validators.required)
    });
  }
  onSave(): void {
    this.isFormSubmit = true;
    this.loadingDialogService.openLoading();
    if (this.memberInfoFrom.invalid){
      this.loadingDialogService.closeLoading();
      return;
    }
    if (!this.memberInfo.id){
      this.memberService.registerNewCustomer(this.memberInfo).pipe(takeUntil(this.subscribe)).subscribe(data => {
        const respone: any = this.pascalCasetoCamelCase.transform(data);
        this.memberInfo = {
          id: respone.data.integralCustomerId,
          email : this.memberInfoFrom.get('email')?.value,
          mobile : this.memberInfoFrom.get('mobile')?.value,
          firstName : this.memberInfoFrom.get('firstName')?.value,
          lastName : this.memberInfoFrom.get('lastName')?.value,
        };
        this.loadingDialogService.closeLoading();
        this.route.navigate(['otp'], { state : { memberInfo : this.memberInfo }});
      });
    }else{
      this.memberInfo = {
        id: this.memberInfo.id,
        email : this.memberInfoFrom.get('email')?.value,
        mobile : this.memberInfoFrom.get('mobile')?.value,
        firstName : this.memberInfoFrom.get('firstName')?.value,
        lastName : this.memberInfoFrom.get('lastName')?.value,
      };
      this.loadingDialogService.closeLoading();
      this.route.navigate(['otp'], {state : { memberInfo : this.memberInfo }});

    }
  }

}
