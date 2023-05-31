import { LandingService, OperatingTime, LMOA } from './../landing.service';
import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faClock, faStar } from '@fortawesome/free-solid-svg-icons';
import { BrendInfo } from '../landing.service';
import * as moment from 'moment';
import { Member } from 'src/app/core/models/member';

@Component({
  selector: 'app-landing-shop',
  templateUrl: './landing-shop.component.html',
  styleUrls: ['./landing-shop.component.scss']
})
export class LandingShopComponent implements OnInit {

  faClock: IconProp = faClock;
  faStar: IconProp = faStar;
  faCircle: IconProp = faCircle;
  brendInfo: BrendInfo;
  currentTime: moment.Moment;
  lmoa: LMOA;
  member: Member;
  constructor(private landingService: LandingService) { }

  ngOnInit(): void {
    this.brendInfo = this.landingService.brendInfo;
    this.currentTime = moment(this.landingService.currentTime , 'HHmm');
    this.lmoa = this.landingService.lmoa;
    this.member = this.landingService.member;
  }

  getTimeFormat(time: string): string {
    return moment(time, 'HH:mm:ss').format('hh:mm a');
  }

  getShopStatus(shopOperatingTime: OperatingTime): string | void {
    const startTime = moment(shopOperatingTime.startTime, 'HH:mm:ss');
    const endTime = moment(shopOperatingTime.endTime, 'HH:mm:ss');
    const lastOrderTime = moment(shopOperatingTime.lastOrderTime, 'HH:mm:ss');
    const breakStartTime1 = moment(shopOperatingTime.breakStartTime1, 'HH:mm:ss');
    const breakEndTime1 = moment(shopOperatingTime.breakEndTime1, 'HH:mm:ss');
    const breakStartTime2 = moment(shopOperatingTime.breakStartTime2, 'HH:mm:ss');
    const breakEndTime2 = moment(shopOperatingTime.breakEndTime2, 'HH:mm:ss');
    const diff1 = lastOrderTime.diff(this.currentTime, 'minutes');
    const diff2 = lastOrderTime.diff(this.currentTime, 'minutes');
    if (lastOrderTime.diff(this.currentTime, 'minutes') < 30 && lastOrderTime.diff(this.currentTime, 'minutes') > 0){
      return 'CLOSING_SOON';
    }
    if (this.currentTime.isBetween(startTime, endTime) && !shopOperatingTime.isClosed){
      return 'OPEN';
    }
    if (this.currentTime.isBetween(breakStartTime1, breakEndTime1) ||
        this.currentTime.isBetween(breakStartTime2, breakEndTime2) ||
        this.currentTime.isBefore(startTime) ||
        this.currentTime.isAfter(endTime) ||
        shopOperatingTime.isClosed || lastOrderTime.diff(this.currentTime, 'minutes') < 1){
        return 'CLOSED';
    }
  }

}
