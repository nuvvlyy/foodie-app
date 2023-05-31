import { ProfileService } from './../../profile.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent implements OnInit {

  isMember = true;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.isMember = this.profileService.profile?.id !== null;
  }

}
