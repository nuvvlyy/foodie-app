import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LineService } from './core/services/line.service';
import { Router, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { LoadingDialogService } from './layout/loading-dialog/loading-dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'foodies-web';
  path: string[] = [];
  pathTitle: string;
  loading = false;

  constructor( private line: LineService, private translate: TranslateService, private router: Router, private titleService: Title,
               private loadingDialogService: LoadingDialogService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    if (!localStorage.getItem('lang')){
      localStorage.setItem('lang', 'en');
    }
    const lang = localStorage.getItem('lang') || 'en' ;
    this.translate.setDefaultLang(lang);
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(lang);
  }
  async ngOnInit(): Promise<void> {
    this.router.events
      .subscribe((event) => {
          if (event instanceof NavigationStart) {
            this.loading = true;
          }
          if (event instanceof NavigationEnd) {
            this.loading = false;
            this.loadingDialogService.closeLoading();
            const title = this.getTitle(this.router.routerState, this.router.routerState.root).pop();
            this.titleService.setTitle(title);
          }
        }
      );
    localStorage.removeItem('member');
    this.line.clear();
  }

  getTitle(state: any, parent: any): any{
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(this.translate.instant(parent.snapshot.data.title.toString()));
    }
    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
}
