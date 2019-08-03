import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DynamicFormModule} from './dynamicForm/dynamic.form.module';
import {DynamicTableModule} from './dynamicTable/dynamic.table.module';
import {DynamicPaginationModule} from './dynamicPagination/dynamic.pagination.module';
import {TypeaheadModule} from 'ngx-bootstrap';
import {SearchSelectComponentModule} from './searchSelect/search.select.module';
import {ExcelPrintModule} from './excelPrint/excel.print.module';

@NgModule({
    declarations: [],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        DynamicFormModule,
        DynamicTableModule,
        DynamicPaginationModule,
        TypeaheadModule.forRoot(),
        SearchSelectComponentModule,
        ExcelPrintModule
    ],
    entryComponents: [],
    exports: []
})

export class CommonComponentsModule {
}
