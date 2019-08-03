import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {DynamicTableModule} from '../../../../common/components/dynamicTable/dynamic.table.module';
import {BsDatepickerModule, ModalModule, TimepickerModule} from 'ngx-bootstrap';
import {LogsComponent} from './logs.component';
import {LogsDetailComponent} from './logs.detail.component';
import {FormsModule} from '@angular/forms';
import {LogsService} from './logs.service';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        LogsComponent,
        LogsDetailComponent
    ],
    imports: [
        // BrowserModule,
        CommonModule,
        RouterModule,
        FormsModule,
        DynamicTableModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot()
    ],
    exports: [
        LogsComponent
    ],
    providers: [
        LogsService
    ],
    entryComponents: [
        LogsDetailComponent
    ]
})
export class LogsModule {
}
