import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TreeModule} from 'angular-tree-component';
import {FormsModule} from '@angular/forms';
import {SearchSelectComponentModule} from '../../../../common/components/searchSelect/search.select.module';
import {ProjectService} from './project.service';
import {ProjectComponent} from './project.component';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {DynamicPaginationModule} from '../../../../common/components/dynamicPagination/dynamic.pagination.module';
import {CommonModule} from '@angular/common';
import {ExcelPrintModule} from '../../../../common/components/excelPrint/excel.print.module';

@NgModule({
    declarations: [
        ProjectComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TreeModule,
        RouterModule,
        SearchSelectComponentModule,
        DynamicPaginationModule,
        BsDatepickerModule.forRoot(),
        ExcelPrintModule
    ],
    exports: [
        ProjectComponent
    ],
    providers: [
        ProjectService
    ]
})
export class ProjectModule {
}
