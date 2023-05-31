
import { NgModule } from '@angular/core';
import { RouterModule, ExtraOptions, PreloadAllModules, PreloadingStrategy, Routes } from '@angular/router';
// import { environment } from 'environments/environment';

import { CommonModule } from '@angular/common';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [

    // {
    //     path: '',
    //     redirectTo: `/404`,
    //     pathMatch: 'full'
    // },
    {
        canActivate: [AuthGuard],
        path: '',
        loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule),
        data: {title: 'landing.menu.name', preload: true}
    },
    {
        canActivate: [AuthGuard],
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
        data: {title: 'profile.menu.name'}
    },
    {
        canActivate: [AuthGuard],
        path: 'otp',
        loadChildren: () => import('./pages/otp/otp.module').then(m => m.OtpModule),
        data: {title: 'otp.name'}
    },
    {
        canActivate: [AuthGuard],
        path: 'address',
        loadChildren: () => import('./pages/address/address.module').then(m => m.AddressModule),
        data: {title: 'address.name'}
    },
    {
        canActivate: [AuthGuard],
        path: 'order',
        loadChildren: () => import('./pages/order/order.module').then(m => m.OrderModule),
        data: {title: 'orderHistory.order'}
    },
    {
        canActivate: [AuthGuard],
        path: 'membership',
        loadChildren: () => import('./pages/membership/membership.module').then(m => m.MembershipModule),
        data: {title: 'membership.name'}
    },
    {
        canActivate: [AuthGuard],
        path: 'promotions',
        loadChildren: () => import('./pages/promotions/promotions.module').then(m => m.PromotionsModule),
        data: { title: 'promotions'}
    },



];
const config: ExtraOptions = {
    useHash: false
};


@NgModule({
    imports: [CommonModule, RouterModule.forRoot(routes,
        {
        preloadingStrategy: PreloadAllModules
      })],
    exports: [RouterModule]
})
export class RoutingModule { }
