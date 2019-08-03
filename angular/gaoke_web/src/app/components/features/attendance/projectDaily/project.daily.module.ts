import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TreeModule} from 'angular-tree-component';
import {FormsModule} from '@angular/forms';
import {SearchSelectComponentModule} from '../../../../common/components/searchSelect/search.select.module';
import {ProjectDailyComponent} from './project.daily.component';
import {BsDatepickerModule, ModalModule} from 'ngx-bootstrap';
import {DynamicPaginationModule} from '../../../../common/components/dynamicPagination/dynamic.pagination.module';
import {ProjectService} from '../project/project.service';
import {ProjectDailyModuleComponent} from './project.daily.modal.component';
import {CommonModule} from '@angular/common';
import {ExcelPrintModule} from '../../../../common/components/excelPrint/excel.print.module';

@NgModule({
    declarations: [
        ProjectDailyComponent,
        ProjectDailyModuleComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TreeModule,
        RouterModule,
        SearchSelectComponentModule,
        DynamicPaginationModule,
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        ExcelPrintModule
    ],
    exports: [
        ProjectDailyComponent,
        ProjectDailyModuleComponent
    ],
    providers: [
        ProjectService
    ],
    entryComponents: [
        ProjectDailyModuleComponent
    ]
})
export class ProjectDailyModule {
}
