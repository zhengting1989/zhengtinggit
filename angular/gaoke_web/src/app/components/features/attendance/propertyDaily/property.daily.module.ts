import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TreeModule} from 'angular-tree-component';
import {FormsModule} from '@angular/forms';
import {SearchSelectComponentModule} from '../../../../common/components/searchSelect/search.select.module';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {DynamicPaginationModule} from '../../../../common/components/dynamicPagination/dynamic.pagination.module';
import {PropertyDailyComponent} from './property.daily.component';
import {PropertyService} from '../property/property.service';
import {ModalModule} from 'ngx-bootstrap';
import {PropertyDailyModuleComponent} from './property.daily.modal.component';
import {CommonModule} from '@angular/common';
import {ExcelPrintModule} from '../../../../common/components/excelPrint/excel.print.module';

@NgModule({
    declarations: [
        PropertyDailyComponent,
        PropertyDailyModuleComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TreeModule,
        RouterModule,
        SearchSelectComponentModule,
        BsDatepickerModule.forRoot(),
        DynamicPaginationModule,
        ModalModule.forRoot(),
        ExcelPrintModule
    ],
    exports: [
        PropertyDailyComponent,
        PropertyDailyModuleComponent
    ],
    providers: [
        PropertyService
    ],
    entryComponents: [
        PropertyDailyModuleComponent
    ]
})
export class PropertyDailyModule {
}
