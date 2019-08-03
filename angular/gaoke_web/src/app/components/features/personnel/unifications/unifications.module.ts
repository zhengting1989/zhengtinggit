import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {TreeModule} from 'angular-tree-component';
import {DynamicTableModule} from '../../../../common/components/dynamicTable/dynamic.table.module';
import {ModalModule} from 'ngx-bootstrap';
import {UnificationsComponent} from './unifications.component';
import {UnificationsService} from './unifications.service';
import {UnificationsDetailComponent} from './unifications.detail.component';
import {FormsModule} from '@angular/forms';
import {DirectivesModule} from '../../../../common/directives/directives.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        UnificationsComponent,
        UnificationsDetailComponent
    ],
    imports: [
        // BrowserModule,
        CommonModule,
        RouterModule,
        FormsModule,
        TreeModule,
        DynamicTableModule,
        ModalModule.forRoot(),
        DirectivesModule
    ],
    exports: [
        UnificationsComponent
    ],
    providers: [
        UnificationsService
    ],
    entryComponents: [
        UnificationsDetailComponent
    ],
})
export class UnificationsModule {
}
