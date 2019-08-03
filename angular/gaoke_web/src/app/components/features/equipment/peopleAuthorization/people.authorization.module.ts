import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {TreeModule} from 'angular-tree-component';
import {DynamicPaginationModule} from '../../../../common/components/dynamicPagination/dynamic.pagination.module';
import {ModalModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {DirectivesModule} from '../../../../common/directives/directives.module';
import {PeopleAuthorizationTableComponent} from './people.authorization.table.component';
import {PeopleAuthorizationComponent} from './people.authorization.component';
import {PeopleAuthorizationModuleComponent} from './people.authorization.module.component';
import {AttendanceService} from '../../setting/authorization/attendance.service';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [
        PeopleAuthorizationComponent,
        PeopleAuthorizationTableComponent,
        PeopleAuthorizationModuleComponent
    ],
    imports: [
        FormsModule,
        // BrowserModule,
        CommonModule,
        RouterModule,
        TreeModule,
        ModalModule.forRoot(),
        DynamicPaginationModule,
        DirectivesModule
    ],
    exports: [
        PeopleAuthorizationComponent,
        PeopleAuthorizationTableComponent,
        PeopleAuthorizationModuleComponent
    ],
    providers: [
        AttendanceService
    ],
    entryComponents: [
        PeopleAuthorizationModuleComponent
    ]
})
export class PeopleAuthorizationModule {
}
