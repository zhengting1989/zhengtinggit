import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthorizationComponent} from './authorization.component';
import {TreeModule} from 'angular-tree-component';
import {AttendanceService} from './attendance.service';
import {AuthorizationTableComponent} from './authorization.table.component';
import {DynamicPaginationModule} from '../../../../common/components/dynamicPagination/dynamic.pagination.module';
import {AuthorizationModuleComponent} from './authorization.module.component';
import {ModalModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {DirectivesModule} from '../../../../common/directives/directives.module';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [
        AuthorizationComponent,
        AuthorizationTableComponent,
        AuthorizationModuleComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        RouterModule,
        TreeModule,
        ModalModule.forRoot(),
        DynamicPaginationModule,
        DirectivesModule
    ],
    exports: [
        AuthorizationComponent,
        AuthorizationTableComponent,
        AuthorizationModuleComponent
    ],
    providers: [
        AttendanceService
    ],
    entryComponents: [
        AuthorizationModuleComponent
    ]
})
export class AuthorizationModule {
}
