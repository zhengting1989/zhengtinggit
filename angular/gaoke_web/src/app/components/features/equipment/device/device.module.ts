import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DeviceComponent} from './device.component';
import {TreeModule} from 'angular-tree-component';
import {DeviceTableComponent} from './device.table.component';
import {ModalModule} from 'ngx-bootstrap';
import {DeviceModalComponent} from './device.modal.component';
import {FormsModule} from '@angular/forms';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {DynamicPaginationModule} from '../../../../common/components/dynamicPagination/dynamic.pagination.module';
import {SearchSelectComponentModule} from '../../../../common/components/searchSelect/search.select.module';
import {DirectivesModule} from '../../../../common/directives/directives.module';
import {DeviceLogModuleComponent} from './device.log.modal.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {CommonModule} from '@angular/common';
import { DeviceInfoModuleComponent } from './device.info.modal.component';

@NgModule({
    declarations: [
        DeviceComponent,
        DeviceTableComponent,
        DeviceModalComponent,
        DeviceLogModuleComponent,
        DeviceInfoModuleComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TreeModule,
        RouterModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        DynamicPaginationModule,
        SearchSelectComponentModule,
        DirectivesModule,
        BsDatepickerModule.forRoot(),
        NgxChartsModule
    ],
    exports: [
        DeviceComponent,
        DeviceTableComponent,
        DeviceModalComponent
    ],
    entryComponents: [
        DeviceModalComponent,
        DeviceLogModuleComponent,
        DeviceInfoModuleComponent
    ]
})
export class DeviceModule {
}
