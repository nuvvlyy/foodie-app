import { MemberService, RequstUpdateProfile } from './../../core/services/member.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Loyalty, Member } from 'src/app/core/models/member';
import { LineService } from 'src/app/core/services/line.service';
import { order } from '../order/order-history/order-history.service';
import { MembershipService } from './membership.service';
import { LoadingDialogService } from 'src/app/layout/loading-dialog/loading-dialog.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PascalCasetoCamelCase } from 'src/app/core/pipes/pascalCasetoCamelCase';
import * as moment from 'moment';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class MembershipComponent implements OnInit , OnDestroy {

  memberDetails: Member;
  orderHistory: Array<order>;
  loyaltyType: string;
  loyalty: Loyalty;
  isShowHeader: boolean;
  isShowDetails = false;
  memberForm: FormGroup;
  memberInfo: any;
  pascalCasetoCamelCase = new PascalCasetoCamelCase();
  isFormSubmit = false;
  // hasBirthday = true;
  genders = [
    { value: 'MALE', label: 'membership.male' , index: '1' },
    { value: 'FEMALE', label: 'membership.female' , index: '2' },
    { value: 'NOT TELLING', label: 'membership.notTelling', index: '3' },
  ];
  maritalStatuses = [
    { value: 'SINGLE', label: 'membership.single', index: '1' },
    { value: 'MARRIED', label: 'membership.married' , index: '2' },
    { value: 'NOT TELLING', label: 'membership.notTelling', index: '3' },
  ];
  clientTypes = [
    { value: 'INDIVIDUAL', label: 'membership.individual', index: '1' },
    { value: 'BUSINESS', label: 'membership.business', index: '2' },
    { value: 'NOT TELLING', label: 'membership.notTelling', index: '3' },
  ];
  public subscribe: Subject<any>;

  constructor(private membershipService: MembershipService, private line: LineService,
              private loadingDialogService: LoadingDialogService, private memberService: MemberService ) { 
                this.subscribe = new Subject();
   }

  ngOnInit(): void {
    this.isShowHeader = !this.line.isInClient();
    this.memberDetails = this.membershipService.member;
    this.orderHistory = this.membershipService.orderHistory;
    this.loyaltyType = this.membershipService.member.loyalty.type.replace(/^\((.+)\)$/, '$1');
    this.loyalty = this.membershipService.member.loyalty;
  }

  ngOnDestroy(): void {
    this.subscribe.next(true);
    this.subscribe.complete();
  }

  async onSubmit(): Promise<void>{
    if (!this.isShowDetails) {
      this.loadingDialogService.openLoading();
      this.isFormSubmit = false;
      this.memberDetails = await this.memberService.getCustomerByEmail(this.memberDetails.email);
      this.memberInfo = {
        birthday: moment(this.memberDetails.birthday).toDate(),
        maritalStatus: this.memberDetails.maritalStatus.toUpperCase(),
        clientType: this.memberDetails.clientType.toUpperCase(),
        gender: this.memberDetails.gender.toUpperCase(),
      };
      this.memberForm =  new FormGroup({
        birthday: new FormControl(moment(this.memberDetails.birthday).toDate(), [
         Validators.required,
        ]),
        maritalStatus: new FormControl(this.memberDetails.maritalStatus.toUpperCase(), [
           Validators.required
        ]),
        clientType: new FormControl(this.memberDetails.clientType.toUpperCase() , Validators.required),
        gender: new FormControl(this.memberDetails.gender.toUpperCase(), Validators.required)
      });
      if (this.memberDetails.birthday){
        this.memberForm.get('birthday')?.disable();
      }
      this.isShowDetails = !this.isShowDetails;
      this.loadingDialogService.closeLoading();
      return;
    }
    this.isFormSubmit = true;
    this.loadingDialogService.openLoading();
    if (this.memberForm.invalid){
      this.loadingDialogService.closeLoading();
      return;
    }
    const requestUpdate: RequstUpdateProfile = {
      mobile: this.memberDetails.phoneNumber,
      firstName: this.memberDetails.firstNameTH || this.memberDetails.firstNameEN,
      lastName: this.memberDetails.lastNameTH || this.memberDetails.lastNameEN,
      birthdate: moment(this.memberForm.get('birthday')?.value).format('YYYY-MM-DDT00:00:00.000Z'),
      contactId: this.memberDetails.id.toString(),
      // birthdate: this.memberForm.get('birthday')?.value,
      gender: this.genders.filter(s => this.memberForm.get('gender')?.value === s.value)[0].index ,
      maritalStatus: this.maritalStatuses.filter(s => this.memberForm.get('maritalStatus')?.value === s.value)[0].index ,
      clientType: this.clientTypes.filter(s => this.memberForm.get('clientType')?.value === s.value)[0].index ,
    };
    const update = await this.memberService.updateProfile(requestUpdate);
    this.loadingDialogService.closeLoading();
    this.isShowDetails = !this.isShowDetails;
    this.isFormSubmit = false;
  }

}
