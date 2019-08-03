import {NgModule} from '@angular/core';
import {HideNodeDirective} from './HideNodeDirective';
import {ReadOnlyDirective} from './ReadOnlyDirective';

@NgModule({
    exports: [
        HideNodeDirective,
        ReadOnlyDirective
    ],
    declarations: [
        HideNodeDirective,
        ReadOnlyDirective
    ]
})

export class DirectivesModule {
}
