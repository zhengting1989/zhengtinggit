import {Component} from '@angular/core';
import {SpinService} from '../../../../common/spin/spin.service';
import {ModuleQueryService} from './module.query.service';


@Component({
    selector: 'atnd-module-query',
    templateUrl: "module.query.template.html",
    styleUrls: ["./module.query.template.scss"]
})
export class ModuleQueryComponent {

    ngOnInit(): void {
        this.getRestDatas(false)
    }

    moduleTable: any = [];
    keyWords: string = "";
    perPagNo: number = 50;
    pageIndex: number = 1;
    total: number = 0;
    keyword: any = '';

    public constructor(private spinService: SpinService,
                       private moduleQueryService: ModuleQueryService,) {
    }

    getRestDatas(perPageChange, parm?) {
        if (!parm) {
            parm = {
                pageIndex: 1,
                perPageNo: 50,
                keyword: this.keyword
            }
        }
        this.spinService.spin(true);
        this.moduleQueryService.getDeviceModule(
            parm,
            res => {
                this.spinService.spin(false);
                this.moduleTable = res.data;
                this.total = res.totalNumbers
                if (perPageChange) {
                    this.total = res ? res.totalNumbers : 0;
                }
            }
        );
    }

    //分页代码修改
    onPaginationChanged(event) {
        let eventPerPagNo = Number(event.perPageNo);
        let eventPageIndex = Number(event.pageIndex);
        this.pageIndex = eventPageIndex;
        if (eventPerPagNo != this.perPagNo) {
            this.perPagNo = eventPerPagNo;
        }
        let perPageChange = event.perPageChange;
        if (perPageChange) {
            this.total = 0;
        }
        let pageIndex = event.pageIndex;
        let parm: any = {
            pageIndex: pageIndex,
            perPageNo: eventPerPagNo,
            keyword: this.keyword
        }
        this.getRestDatas(perPageChange, parm)
    }

    search() {
        this.pageIndex = 1;
        this.total = 0;
        let parm: any = {
            pageIndex: this.pageIndex,
            perPageNo: this.perPagNo,
            keyword: this.keyword
        }
        this.getRestDatas(false, parm)
    }

    enterSearch(e) {
        if (e.keyCode == 13) {
            this.search();
        }
    }
}
