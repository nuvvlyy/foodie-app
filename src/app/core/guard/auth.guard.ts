import { savePrimaryColor } from 'src/app/core/utils/common';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenService } from '../services/authen.service';
import { LineService } from '../services/line.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private route: Router,
    private routeActive: ActivatedRoute,
    private authService: AuthenService,
    private lineService: LineService) {
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
      savePrimaryColor();
      await this.lineService.initLine(environment.lineLiff);
      const profile = await this.lineService.getProfile();
      return profile ? true : false;

  }

}
