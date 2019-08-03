import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DynamicFormComponent} from './dynamic.form.component';
import {ModalModule} from 'ngx-bootstrap';


@NgModule({
    declarations: [
        DynamicFormComponent
    ],
    imports: [
        FormsModule,
        // BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        ModalModule.forRoot()
    ],
    exports: [
        DynamicFormComponent
    ],
    entryComponents: [
        DynamicFormComponent
    ]
})

export class DynamicFormModule {
}
