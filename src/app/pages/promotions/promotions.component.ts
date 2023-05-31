import { TranslateService } from '@ngx-translate/core';
import { Promotion, PromotionsService } from './promotions.service';
import { Component, OnInit } from '@angular/core';
import { LineService } from 'src/app/core/services/line.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {

  promotions: Promotion[];
  isShowHeader: boolean;
  constructor(private promotionsService: PromotionsService, private line: LineService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.promotions = this.promotionsService.promotion;
    this.isShowHeader = !this.line.isInClient();
  }
  getPromotionTitle(promotion: Promotion): string{
    const lang: string = this.translateService.getDefaultLang();
    const title = promotion.title;
    switch (lang){
      case 'en': {
        return promotion.title;
      }
      case 'th': {
        return promotion.titleTH;
      }
      default: {
        return promotion.title;
     }
    }
  }
  getPromotionDescription(promotion: Promotion): string{
    const lang: string = this.translateService.getDefaultLang();
    const title = promotion.title;
    switch (lang){
      case 'en': {
        return promotion.description;
      }
      case 'th': {
        return promotion.descriptionTH;
      }
      default: {
        return promotion.description;
     }
    }
  }

}
