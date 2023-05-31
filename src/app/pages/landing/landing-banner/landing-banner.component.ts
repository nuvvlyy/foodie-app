import { LandingService } from './../landing.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface
} from 'ngx-swiper-wrapper';
import { BannerInfo } from '../landing.service';

@Component({
  selector: 'app-landing-banner',
  templateUrl: './landing-banner.component.html',
  styleUrls: ['./landing-banner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LandingBannerComponent implements OnInit {

  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 30,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: false,
    pagination: true,
    loop: true,
    autoplay: {
      delay: 5000
    }
  };
  banners: Array<BannerInfo>;

  @ViewChild(SwiperDirective, { static: false }) directiveRef?: SwiperDirective;

  constructor(private landingService: LandingService) { }

  ngOnInit(): void {
    this.banners = this.landingService.banners;
  }

  public onIndexChange(index: number): void {

  }

}
