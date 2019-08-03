import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DirectivesModule} from '../../../../common/directives/directives.module';
import {CommonModule} from '@angular/common';
import {ModuleQueryComponent} from './module.query.component';
import {ModuleQueryService} from './module.query.service';
import {DynamicPaginationModule} from '../../../../common/components/dynamicPagination/dynamic.pagination.module';

@NgModule({
    declarations: [
        ModuleQueryComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        DirectivesModule,
        DynamicPaginationModule,
    ],
    exports: [
        ModuleQueryComponent
    ],
    providers: [
        ModuleQueryService
    ]
})
export class ModuleQueryModule {
}
