import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {GroupsModule} from './groups/groups.module';
import {UsersModule} from './users/users.module';
import {CommonModule} from '@angular/common';
import {PersonnelRoutingModule} from "./personnel-routing.module";
import {UnificationsModule} from './unifications/unifications.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule,
        GroupsModule,
        UsersModule,
        UnificationsModule,
        PersonnelRoutingModule
    ],
    exports: []
})
export class PersonnelModule {
}
