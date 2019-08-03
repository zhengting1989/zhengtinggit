import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {ModalModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {SoftwareComponent} from './software.component';
import {SoftwareFormComponent} from './software.form.component';
import {SoftwareService} from './software.service';
import {DirectivesModule} from '../../../../common/directives/directives.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        SoftwareComponent,
        SoftwareFormComponent
    ],
    imports: [
        // BrowserModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ModalModule.forRoot(),
        DirectivesModule
    ],
    exports: [
        SoftwareComponent
    ],
    providers: [
        SoftwareService
    ],
    entryComponents: [
        SoftwareFormComponent


    ]
})
export class SoftwareModule {
}
