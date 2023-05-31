
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from './directives/directive';


// const PROVIDERS = [
//   { provide: ErrorHandler, useClass: ErrorsHandler },
//   InterceptorProvider,
//   CookieService,
//   SplashScreenService
// ];

@NgModule({
  declarations: [
    // DirectivesModule
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports  : [
    DirectivesModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class CoreModule { }
