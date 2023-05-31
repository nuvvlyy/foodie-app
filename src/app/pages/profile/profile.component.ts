import { LineProfile } from './../../core/models/line-profile';
import { ProfileService } from './profile.service';
import { Component, OnInit } from '@angular/core';
import { requstMember } from 'src/app/core/services/member.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  memberInfo: requstMember;
  lineProfile: LineProfile;
  constructor(private profileService: ProfileService) {
  }

  ngOnInit(): void{
    this.lineProfile = this.profileService.lineProfile;
  }

}
