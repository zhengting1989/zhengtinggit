import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExcelPrintComponent} from './excel.print.component';


@NgModule({
    declarations: [
        ExcelPrintComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ExcelPrintComponent
    ],
    entryComponents: [
        ExcelPrintComponent
    ]
})

export class ExcelPrintModule {

}
