import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DeviceModule} from './device/device.module';
import {PeopleAuthorizationModule} from './peopleAuthorization/people.authorization.module';
import {CommonModule} from '@angular/common';
import {EquipmentRoutingModule} from './equipment-routing.module';
import {AuthorizationModule} from '../setting/authorization/authorization.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule,
        DeviceModule,
        PeopleAuthorizationModule,
        AuthorizationModule,
        EquipmentRoutingModule
    ],
    exports: []
})
export class EquipmentModule {
}
