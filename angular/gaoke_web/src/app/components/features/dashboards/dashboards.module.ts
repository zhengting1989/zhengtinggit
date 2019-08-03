import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ModalModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {PeityModule} from '../../../common/directives/charts/peity';
import {DashboardTimeService} from './dashboard.time.service';
import {DashboardPlatformCommonPieComponent} from './platform/platform.common.pie.component';
import {DashboardDeviceDetailsComponent} from './device.details.component';
import {DashboardPropertyBarComponent} from './property/property.bar.component';
import {DashboardPropertyCommonPieComponent} from './property/property.common.pie.component';
import {DashboardClickDetailsComponent} from './click.details.component';
import {DashboardPlatformComponent} from './platform/platform.dashboard.component';
import {DashboardPropertyComponent} from './property/property.dashboard.component';
import {DashboardProjectComponent} from './project/project.dashboard.component';
import {DashboardDeviceService} from './dashboard.device.service';
import {CommonModule} from '@angular/common';
import {DashboardsRoutingModule} from "./dashboards-routing.module";

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardProjectComponent,
        DashboardPropertyComponent,
        DashboardPropertyBarComponent,
        DashboardPropertyCommonPieComponent,
        DashboardClickDetailsComponent,
        DashboardPlatformCommonPieComponent,
        DashboardPlatformComponent,
        DashboardDeviceDetailsComponent
    ],
    imports: [
        CommonModule,
        DashboardsRoutingModule,
        RouterModule,
        FormsModule,
        ModalModule.forRoot(),
        NgxChartsModule,
        PeityModule
    ],
    exports: [
        DashboardComponent,
        DashboardProjectComponent,
        DashboardPropertyComponent,
        DashboardPropertyBarComponent,
        DashboardPropertyCommonPieComponent,
        DashboardClickDetailsComponent,
        DashboardPlatformCommonPieComponent,
        DashboardPlatformComponent,
        DashboardDeviceDetailsComponent
    ],
    providers: [
        DashboardTimeService,
        DashboardDeviceService
    ],
    entryComponents: [
        DashboardClickDetailsComponent,
        DashboardDeviceDetailsComponent
    ]
})
export class DashboardsModule {
}
