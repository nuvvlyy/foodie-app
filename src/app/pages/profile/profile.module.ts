import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from 'src/app/layout/layout.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ProfileContentComponent } from './profile-content/profile-content.component';
import { ProfileImageComponent } from './profile-image/profile-image.component';
import { ProfileMenuComponent } from './profile-content/profile-menu/profile-menu.component';
import { ProfileDetailComponent } from './profile-content/profile-detail/profile-detail.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

const routes: Routes = [
  {
      path: '',
      component: ProfileComponent,
      resolve: {
        profile: ProfileService
      }
  }
];

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    TranslateModule,
    // BrowserAnimationsModule,
    // BsDropdownModule.forRoot(),

    RouterModule.forChild(routes),
    NgxMaskModule.forRoot(maskConfig),
  ],
  declarations: [
    ProfileComponent,
    ProfileHeaderComponent,
    ProfileContentComponent,
    ProfileImageComponent,
    ProfileMenuComponent,
    ProfileDetailComponent
  ],
  providers: [
    ProfileService,
    NgbDropdownModule
  ]
})
export class ProfileModule { }
