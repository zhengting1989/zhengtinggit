import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap';
import {DynamicFormModule} from '../dynamicForm/dynamic.form.module';
import {DynamicTableComponent} from './dynamic.table.component';
import {DynamicPaginationModule} from '../dynamicPagination/dynamic.pagination.module';
import {DynamicTableDetailComponent} from './dynamic.table.detail.component';
import {DirectivesModule} from '../../directives/directives.module';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [
        DynamicTableComponent,
        DynamicTableDetailComponent
    ],
    imports: [
        FormsModule,
        // BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        DynamicFormModule,
        DynamicPaginationModule,
        DirectivesModule
    ],
    exports: [
        DynamicTableComponent
    ],
    entryComponents: [
        DynamicTableComponent,
        DynamicTableDetailComponent
    ]
})

export class DynamicTableModule {
}
