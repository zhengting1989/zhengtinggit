import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MenuModule} from './menu/menu.module';
import {DashboardsModule} from './dashboards/dashboards.module';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule,
        MenuModule,
        DashboardsModule
    ],
    exports: []
})

export class FeaturesModule {
}
