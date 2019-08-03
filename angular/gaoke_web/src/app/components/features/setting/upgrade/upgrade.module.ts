import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {UpgradeComponent} from './upgrade.component';
import {UpgradeService} from './upgrade.service';
import {FormsModule} from '@angular/forms';
import {UpgradeModalComponent} from './upgrade.modal.components';
import {DynamicPaginationModule} from '../../../../common/components/dynamicPagination/dynamic.pagination.module';
import {DirectivesModule} from '../../../../common/directives/directives.module';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [
        UpgradeComponent,
        UpgradeModalComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        RouterModule,
        DynamicPaginationModule,
        DirectivesModule
    ],
    exports: [
        UpgradeComponent,
        UpgradeModalComponent
    ],
    providers: [
        UpgradeService
    ],
    entryComponents: [
        UpgradeModalComponent
    ]
})
export class UpgradeModule {
}
