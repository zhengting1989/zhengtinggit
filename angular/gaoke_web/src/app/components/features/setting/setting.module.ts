import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SettingComponent} from './setting.component';
import {AboutModule} from './about/about.module';
import {LogsModule} from './logs/logs.module';
import {SoftwareModule} from './software/software.module';
import {CommonModule} from '@angular/common';
import {SettingRoutingModule} from './setting-routing.module';
import {UpgradeModule} from './upgrade/upgrade.module';
import {AuthorizationModule} from './authorization/authorization.module';
import { ModuleQueryModule } from './moduleQuery/module.query.module';

@NgModule({
    declarations: [
        SettingComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        AboutModule,
        LogsModule,
        SoftwareModule,
        AuthorizationModule,
        SettingRoutingModule,
        UpgradeModule,
        ModuleQueryModule
    ],
    exports: [
        SettingComponent
    ]
})
export class SettingModule {
}
