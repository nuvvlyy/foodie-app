import { Router } from '@angular/router';
import { ProfileService } from './../profile/profile.service';
import { TranslateService } from '@ngx-translate/core';
import { LandingService } from './landing.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LineService } from 'src/app/core/services/line.service';
import { savePrimaryColor } from 'src/app/core/utils/common';
import { LoadingDialogService } from 'src/app/layout/loading-dialog/loading-dialog.service';

export interface Color {
  name: string;
  hex: string;
  darkContrast: boolean;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  primaryColor = '#E02C2B';
  language: string;
  isMember = true;

  primaryColorPalette: Color[] = [];

  constructor(private titleService: Title, private landingService: LandingService, private translate: TranslateService,
              private lineService: LineService, private loadingDialogService: LoadingDialogService, private route: Router) { }

  ngOnInit(): void {
    if (!this.landingService.member.id){
      this.route.navigateByUrl('/profile');
      return;
    }
    this.isMember = !!this.landingService.member.id;
    this.titleService.setTitle(': Foodie24x7 Line Services :.');
    this.primaryColor = this.landingService.lmoa.colorCode;
    savePrimaryColor();
    this.language = this.translate.getDefaultLang();
  }

  openStartOrderPage(): void{
    if (!this.isMember){
      this.route.navigateByUrl('/profile');
      return;
    }
    this.lineService.openUrl(this.landingService.lmoa.lINEOrderOnline || '', false);
  }

  switchLanguage(): void{
    this.language === 'th' ? this.setLanguage('en') : this.setLanguage('th');
  }

  setLanguage(language: string): void {
    this.loadingDialogService.openLoading();
    localStorage.setItem('lang', language);
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(language);
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(language);
    this.language = language;
    this.loadingDialogService.closeLoading();
  }
}
