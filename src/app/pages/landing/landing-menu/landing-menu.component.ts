import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-landing-menu',
  templateUrl: './landing-menu.component.html',
  styleUrls: ['./landing-menu.component.scss']
})
export class LandingMenuComponent implements OnInit {

  isMember = true;
  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.isMember = this.profileService.profile?.id !== null;
  }

}
