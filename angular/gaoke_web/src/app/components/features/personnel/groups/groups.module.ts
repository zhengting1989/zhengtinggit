import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {GroupsComponent} from './groups.component';
import {GroupsService} from './groups.service';
import {TreeModule} from 'angular-tree-component';
import {ModalModule, TabsModule} from 'ngx-bootstrap';
import {GroupsDetailComponent} from './groups.detail.component';
import {FormsModule} from '@angular/forms';
import {GroupUserComponent} from './groupUsers/group.user.component';
import {GroupMenuComponent} from './groupMenus/group.menu.component';
import {GroupMenuService} from './groupMenus/group.menu.service';
import {GroupUserService} from './groupUsers/group.user.service';
import {DynamicTableModule} from '../../../../common/components/dynamicTable/dynamic.table.module';
import {GroupUserOperateConfirmComponent} from './groupUsers/group.user.operate.confirm.component';
import {DirectivesModule} from '../../../../common/directives/directives.module';
import {CrossDomainComponent} from './crossDomain/cross.domain.component';
import {CrossDomainService} from './crossDomain/cross.domain.service';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        GroupsComponent,
        GroupsDetailComponent,
        GroupUserComponent,
        GroupMenuComponent,
        GroupUserOperateConfirmComponent,
        CrossDomainComponent
    ],
    imports: [
        // BrowserModule,
        CommonModule,
        RouterModule,
        FormsModule,
        TreeModule,
        DynamicTableModule,
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        DirectivesModule
    ],
    exports: [
        GroupsComponent
    ],
    providers: [
        GroupsService,
        GroupMenuService,
        GroupUserService,
        CrossDomainService
    ],
    entryComponents: [
        GroupsDetailComponent,
        GroupUserOperateConfirmComponent
    ]
})
export class GroupsModule {
}
