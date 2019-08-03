import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {TypeaheadModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {SearchSelectComponent} from './search.select.componet';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [
        SearchSelectComponent
    ],
    imports: [
        FormsModule,
        // BrowserModule,
        CommonModule,
        TypeaheadModule.forRoot(),
    ],
    exports: [
        SearchSelectComponent
    ],
    entryComponents: [
        SearchSelectComponent
    ]
})

export class SearchSelectComponentModule {
}
