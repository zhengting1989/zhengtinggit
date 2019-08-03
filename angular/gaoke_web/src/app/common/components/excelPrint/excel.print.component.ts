import {Component, Input} from '@angular/core';

import * as XLSX from 'xlsx';
import {PrintData} from './excel.print.option';

declare var saveAs: any;


@Component({
    selector: 'atnd-excel-print',
    template: `
        <div style="display: none;height: 0px;"></div>
    `
})
export class ExcelPrintComponent {

    writeOpts: XLSX.WritingOptions = {bookType: 'xlsx', type: 'binary'};
    @Input() printData: PrintData;
    uA = window.navigator.userAgent;
    isIE = /msie\s|trident\/|edge\//i.test(this.uA) && !!("uniqueID" in document || "documentMode" in document || ("ActiveXObject" in window) || "MSInputMethodContext" in window);
  
    s2ab(s: string): ArrayBuffer {
        const length = s.length;
        const buf = new ArrayBuffer(length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    exportTable(json) {
        if(this.isIE){
            //兼容ie11 ==>不能传入html内容，需要传入dom节点
            let parser = new DOMParser();
            let wb = XLSX.utils.table_to_book(document.getElementById(json));
            const wbWriteOut = XLSX.write(wb, this.writeOpts);
            let downloadTitle = this.printData.downloadTitle ? this.printData.downloadTitle : '报表' + new Date().getTime();
            saveAs(new Blob([this.s2ab(wbWriteOut)]), downloadTitle + '.xlsx');
        }else{
            let parser = new DOMParser();
            let downLoadDocument = parser.parseFromString(json, 'text/xml');
            let wb = XLSX.utils.table_to_book(downLoadDocument);
            const wbWriteOut = XLSX.write(wb, this.writeOpts);
            let downloadTitle = this.printData.downloadTitle ? this.printData.downloadTitle : '报表' + new Date().getTime();
            saveAs(new Blob([this.s2ab(wbWriteOut)]), downloadTitle + '.xlsx');
        }
    }

    ngOnChanges() {
        if (this.printData && this.printData.printJson) {
            this.exportTable(this.printData.printJson);
        }
    }

}
