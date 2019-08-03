import {Component, OnInit} from '@angular/core';
import {DynamicTableOption} from '../../../../common/components/dynamicTable/dynamic.table.option';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {LogsDetailComponent} from './logs.detail.component';
import {LogsService} from './logs.service';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {zhCnLocale} from 'ngx-bootstrap/locale';
import {AlertService} from '../../../../common/alert.service';

declare var jQuery: any;
defineLocale('zh-cn', zhCnLocale);

@Component({
    selector: 'atnd-setting-logs',
    template: `
        <div class="wrapper wrapper-content">
            <div class="row  white-bg" style="padding-top: 5px;">
                <div class="col-md-3">
                    <input placeholder="请选择查询时间范围"
                           readonly style='background-color: #fff;!important'
                           type="text"
                           class="form-control"
                           bsDaterangepicker
                           [minDate]="minDate"
                           [maxDate]="maxDate"
                           [(ngModel)]="dateRangePickerModel"
                           [bsConfig]="{showWeekNumbers: false,dateInputFormat: 'YYYY/MM/DD'}"
                           #dpr="bsDaterangepicker">
                </div>
                <div class="col-md-5 time">
                        <timepicker [(ngModel)]="myMinTime"
                                    [showSpinners]="false"
                                    [showMinutes]="true"
                                    [showMeridian]="false"
                                    [showSeconds]="true">
                        </timepicker>
                        <span class="label label-primary span">至</span>
                        <timepicker [(ngModel)]="myMaxTime"
                                    [showSpinners]="false"
                                    [showMinutes]="true"
                                    [showMeridian]="false"
                                    [showSeconds]="true">
                        </timepicker>
                </div>
                <div class="col-md-4">
                    <div class="input-group">
                        <input type="text" placeholder="请按照关键字(操作描述/操作人)进行搜索"
                               class="form-control"
                               [(ngModel)]="keyWords"
                               (keypress)="searchByKeywords($event)">
                        <span class="input-group-btn">
                        <button type="button"
                                class="btn btn-primary"
                                (click)="toSearch()">
                            <i class="fa fa-search"></i>&nbsp;搜索
                        </button>
                    </span>
                    </div>
                </div>
            </div>
            <div class="row white-bg" style="margin-top: -20px !important;margin-bottom: 50px !important;">
                <atnd-dynamic-table
                        [checkBox]="false"
                        [queryParam]="queryParam"
                        [columns]="columns"
                        [tableOption]="tableOption"
                        [perPageNo]="50"
                        (singleCallback)="singleCallback($event)"
                        [commonTableService]="logsService">
                </atnd-dynamic-table>
            </div>
        </div>
    `,
    styles:['.span{display: inline-block ;width: 34px;margin: 0 5px;height: 34px;line-height: 29px;}.time{display: flex;align-items: center;justify-content: center;}']
})
export class LogsComponent implements OnInit {

    modalRef: BsModalRef;
    queryParam: any;
    dateRangePickerModel: Date[] = [new Date(), new Date()];
    minDate: any = new Date('2018-01-01');
    maxDate: any = new Date();
    uA = window.navigator.userAgent;
    isIE = /msie\s|trident\/|edge\//i.test(this.uA) && !!("uniqueID" in document || "documentMode" in document || ("ActiveXObject" in window) || "MSInputMethodContext" in window);

    ngOnInit(): void {
        //兼容ie11初始化值的问题
        if(this.isIE){
            let myMinTime = new Date();
            myMinTime.setHours(0);
            myMinTime.setMinutes(0);
            myMinTime.setSeconds(0);
            this.myMinTime = myMinTime;

            let myMaxTime = new Date();
            myMaxTime.setHours(23);
            myMaxTime.setMinutes(59);
            myMaxTime.setSeconds(59);
            this.myMaxTime = myMaxTime;

            this.queryParam={
                startTime: this.formatDateToStr(new Date(), this.myMinTime),
                endTime: this.formatDateToStr(new Date(), this.myMaxTime),
                keyword:"",
                perPageNo:50,
                queryKeywords: ""}
        }else{
            this.queryParam = this.checkDate();
            this.queryParam['queryKeywords'] = this.keyWords;
        }
    }
    columns = [
        {
            name: '操作描述',
            value: 'description'
        },
        {
            name: '操作人',
            value: 'userName',
            orderBy: 'DESC'
        },
        {
            name: '操作时间',
            value: 'createTime',
            orderBy: 'DESC'
        }
    ];
    tableOption: DynamicTableOption = {
        singleMethods: [
            {
                type: 'detail',
                label: '详情',
                faIcon: 'fa fa-eye',
                class: 'btn btn-sm btn-info'
            }
        ]
    };
    myMinTime: any = new Date('2018-01-01 00:00:00');
    myMaxTime: any = new Date('2018-01-01 23:59:59');
    keyWords: string='';

    public constructor(public logsService: LogsService,
                       private modalService: BsModalService,
                       private _localeService: BsLocaleService,
                       private alertService: AlertService) {
        this._localeService.use('zh-cn');
    }

    singleCallback(event) {
        const initialState = {
            initialState: {
                detail: JSON.parse(JSON.stringify(event.data))
            }
        };
        this.modalRef = this.modalService.show(LogsDetailComponent, initialState);
    }

    toSearch() {
        let params: any = this.checkDate();
        if (params) {
            this.queryParam = this.checkDate();
            this.queryParam['queryKeywords'] = this.keyWords;
        }
    }

    searchByKeywords(event) {
        if (event) {
            var code = (event.keyCode ? event.keyCode : event.which);
            if (code != 13) {
                return;
            }
        }
        let params: any = this.checkDate();
        if (params) {
            this.queryParam = this.checkDate();
            this.queryParam['queryKeywords'] = this.keyWords;
        }
    }

    checkDate() {
        this.dateRangePickerModel = this.dateRangePickerModel || [];
        if (!(this.dateRangePickerModel && this.dateRangePickerModel.length === 2)) {
            this.alertService.showWarningAlert(undefined, '请选择日期范围');
            return null;
        }
        let startDate: any = this.dateRangePickerModel[0];
        let endDate: any = this.dateRangePickerModel[1];
        let startNum = this.formatDateToNum(startDate, this.myMinTime);
        if (!startNum) {
            this.alertService.showWarningAlert(undefined, '请正确的先填写开始时间');
            return null;
        }
        let endNum = this.formatDateToNum(endDate, this.myMaxTime);
        if (!endNum) {
            this.alertService.showWarningAlert(undefined, '请正确的先填写结束时间');
            return null;
        }
        if (endNum < startNum) {
            this.alertService.showWarningAlert(undefined, '时间范围必须是结束时间大于等于开始时间');
            return null;
        }
        return {
            startTime: this.formatDateToStr(startDate, this.myMinTime),
            endTime: this.formatDateToStr(endDate, this.myMaxTime)
        };
    }

    formatDateToNum(datePicker: any, timePicker: any): number {
        if (datePicker && timePicker) {
            let dateSatr = datePicker.getFullYear() + ''
                + this.formatNumAddZero(datePicker.getMonth() + 1) + ''
                + this.formatNumAddZero(datePicker.getDate()) + ''
                + this.formatNumAddZero(timePicker.getHours()) + ''
                + this.formatNumAddZero(timePicker.getMinutes()) + ''
                + this.formatNumAddZero(timePicker.getSeconds());
            return Number(dateSatr);
        }
        return null;
    }

    formatDateToStr(datePicker: any, timePicker: any): string {
        if (datePicker && timePicker) {
            return datePicker.getFullYear() + '-'
                + this.formatNumAddZero(datePicker.getMonth() + 1) + '-'
                + this.formatNumAddZero(datePicker.getDate()) + ' '
                + this.formatNumAddZero(timePicker.getHours()) + ':'
                + this.formatNumAddZero(timePicker.getMinutes()) + ':'
                + this.formatNumAddZero(timePicker.getSeconds());
        }
        return null;
    }

    formatNumAddZero(num: number): string {
        return '' + (num < 10 ? '0' : '') + num
    }
}
