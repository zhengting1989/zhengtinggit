import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {UsersComponent} from './users.component';
import {TreeModule} from 'angular-tree-component';
import {DynamicTableModule} from '../../../../common/components/dynamicTable/dynamic.table.module';
import {UsersService} from './users.service';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import {UsersDetailComponent} from './users.detail.component';
import {UsersFormComponent} from './users.form.component';
import {FormsModule} from '@angular/forms';
import {DirectivesModule} from '../../../../common/directives/directives.module';
import {UsersUploadComponent} from './users.upload.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        UsersComponent,
        UsersDetailComponent,
        UsersFormComponent,
        UsersUploadComponent
    ],
    imports: [
        // BrowserModule,
        CommonModule,
        RouterModule,
        FormsModule,
        TreeModule,
        DynamicTableModule,
        ModalModule.forRoot(),
        DirectivesModule,
        AlertModule.forRoot()
    ],
    exports: [
        UsersComponent
    ],
    providers: [
        UsersService
    ],
    entryComponents:[
        UsersDetailComponent,
        UsersFormComponent,
        UsersUploadComponent
    ]
})
export class UsersModule {
}
