import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AttendanceComponent} from './attendance.component';
import {ProjectModule} from './project/project.module';
import {PropertytModule} from './property/property.module';
import {PropertyDailyModule} from './propertyDaily/property.daily.module';
import {ProjectDailyModule} from './projectDaily/project.daily.module';
import {CommonModule} from '@angular/common';
import {AttendanceRoutingModule} from "./attendance-routing.module";

@NgModule({
    declarations: [
        AttendanceComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ProjectModule,
        PropertytModule,
        ProjectDailyModule,
        PropertyDailyModule,
        AttendanceRoutingModule
    ],
    exports: [
        AttendanceComponent
    ]
})
export class AttendanceModule {
}
