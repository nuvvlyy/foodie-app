import { LineProfile } from './../../core/models/line-profile';
import { LineService } from './../../core/services/line.service';
import { MemberService } from './../../core/services/member.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from 'src/app/core/models/member';

@Injectable({
  providedIn: 'root'
})
export class ProfileService implements Resolve<any> {

  profile: Member = {
    firstNameEN: null,
    fastNameEN: null,
    phoneNumber: null,
    email: null,
    id: null
  } as unknown as Member;
  lineProfile: LineProfile;
  isNewUser = false;

  constructor(private memberService: MemberService, private lineService: LineService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getLineProfile(),
        this.getCustomerProfile(),
        // this.getProduct().toPromise()
      ]).then(
        ([lineProfile, profile]) => {
          this.lineProfile = lineProfile;
          this.profile = profile;
          resolve(true);
        },
        reject
      );
    });
  }

  async getCustomerProfile(): Promise<Member> {
    const profile = await this.memberService.getProfileByLineId();
    if (profile.userName === null) {
      this.isNewUser = true;
      const member = {
        firstNameEN: null,
        fastNameEN: null,
        phoneNumber: null,
        email: null,
        id: null
      } as unknown as Member;
      return Promise.resolve(member);
    }
    return this.memberService.getCustomerByEmail(profile.userName);
  }

  async getLineProfile(): Promise<LineProfile> {
    const profile = await this.lineService.getProfile();
    return profile;
  }

}
