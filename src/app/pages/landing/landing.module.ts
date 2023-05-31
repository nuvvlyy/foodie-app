import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LandingService } from './landing.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { Routes, RouterModule } from '@angular/router';
import { LandingBannerComponent } from './landing-banner/landing-banner.component';
import { LandingShopComponent } from './landing-shop/landing-shop.component';
import { LandingMenuComponent } from './landing-menu/landing-menu.component';
import { SwiperModule, SwiperConfigInterface, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { ProfileService } from '../profile/profile.service';
import { CoreModule } from 'src/app/core/core.module';

const routes: Routes = [
  {
      path: '',
      component: LandingComponent,
      resolve: {
        landing: LandingService,
        profile: ProfileService
      }
  }
];

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  observer: true,
  direction: 'horizontal',
  threshold: 50,
  spaceBetween: 5,
  slidesPerView: 1,
  centeredSlides: true
};

@NgModule({
  declarations: [
    LandingComponent,
    LandingBannerComponent,
    LandingShopComponent,
    LandingMenuComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    RouterModule.forChild(routes),
    SwiperModule,
    FontAwesomeModule,
    TranslateModule
  ],

  providers: [
    LandingService,
    ProfileService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class LandingModule { }
