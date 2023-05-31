import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadingDialogService } from 'src/app/layout/loading-dialog/loading-dialog.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent implements OnInit {

  language: string;
  constructor(private translate: TranslateService , private loadingDialogService: LoadingDialogService) { }

  ngOnInit(): void {
    this.language = this.translate.getDefaultLang();
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
