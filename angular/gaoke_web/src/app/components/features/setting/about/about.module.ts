import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {DynamicTableModule} from '../../../../common/components/dynamicTable/dynamic.table.module';
import {ModalModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {DirectivesModule} from '../../../../common/directives/directives.module';
import {AboutComponent} from './about.component';
import {AboutService} from './about.service';
import {AboutDetailComponent} from './about.detail.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AboutComponent,
        AboutDetailComponent
    ],
    imports: [
        // BrowserModule,
        CommonModule,
        RouterModule,
        FormsModule,
        DynamicTableModule,
        ModalModule.forRoot(),
        DirectivesModule
    ],
    exports: [
        AboutComponent
    ],
    providers: [
        AboutService
    ],
    entryComponents: [
        AboutDetailComponent
    ]
})
export class AboutModule {
}
