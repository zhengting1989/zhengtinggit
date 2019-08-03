import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {BsDropdownModule} from 'ngx-bootstrap';
import {FooterComponent} from '../footer/footer.component';
import {BasicLayoutComponent} from './basicLayout.component';
import {BlankLayoutComponent} from './blankLayout.component';
import {NavigationComponent} from '../navigation/navigation.component';
import {TopNavigationLayoutComponent} from '../topnavbar/topNavigationLayout.component';
import {TopNavbarComponent} from '../topnavbar/topnavbar.component';
import {TopNavigationNavbarComponent} from '../topnavbar/topnavigationnavbar.component';
import {TopTitleComponent} from '../topTitle/top.title.component';

@NgModule({
    declarations: [
        FooterComponent,
        BasicLayoutComponent,
        BlankLayoutComponent,
        NavigationComponent,
        TopNavigationLayoutComponent,
        TopNavbarComponent,
        TopNavigationNavbarComponent,
        TopTitleComponent
    ],
    imports: [
        // BrowserModule,
        CommonModule,
        RouterModule,
        BsDropdownModule.forRoot()
    ],
    exports: [
        FooterComponent,
        BasicLayoutComponent,
        BlankLayoutComponent,
        NavigationComponent,
        TopNavigationLayoutComponent,
        TopNavbarComponent,
        TopNavigationNavbarComponent,
        TopTitleComponent
    ],
})

export class LayoutsModule {
}
