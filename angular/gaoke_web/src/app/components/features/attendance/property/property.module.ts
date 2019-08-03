import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TreeModule} from 'angular-tree-component';
import {FormsModule} from '@angular/forms';
import {SearchSelectComponentModule} from '../../../../common/components/searchSelect/search.select.module';
import {PropertyService} from './property.service';
import {PropertyComponent} from './property.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {DynamicPaginationModule} from '../../../../common/components/dynamicPagination/dynamic.pagination.module';
import {CommonModule} from '@angular/common';
import {ExcelPrintModule} from '../../../../common/components/excelPrint/excel.print.module';

@NgModule({
    declarations: [
        PropertyComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TreeModule,
        RouterModule,
        SearchSelectComponentModule,
        BsDatepickerModule.forRoot(),
        DynamicPaginationModule,
        ExcelPrintModule
    ],
    exports: [
        PropertyComponent
    ],
    providers: [
        PropertyService
    ]
})
export class PropertytModule {
}
