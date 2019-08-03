import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {DynamicPaginationComponent} from './dynamic.pagination.component';
import {PaginationModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [
        DynamicPaginationComponent
    ],
    imports: [
        FormsModule,
        // BrowserModule,
        CommonModule,
        PaginationModule.forRoot()
    ],
    exports: [
        DynamicPaginationComponent
    ],
    entryComponents: [
        DynamicPaginationComponent
    ]
})

export class DynamicPaginationModule {
}
