import {Component} from "@angular/core";
import {BsDatepickerConfig, BsLocaleService, BsModalRef} from "ngx-bootstrap";
import {DeviceService} from "./device.service";
import {SpinService} from "../../../../common/spin/spin.service";
import {defineLocale} from 'ngx-bootstrap/chronos';
import {zhCnLocale} from 'ngx-bootstrap/locale';

defineLocale('zh-cn', zhCnLocale);
declare var jQuery: any;

@Component({
    selector: "atnd-device-log-module",
    templateUrl: "device.log.modal.template.html",
    styleUrls: ["./device.template.scss"]
})
export class DeviceLogModuleComponent {
    public constructor(public bsModalRef: BsModalRef,
                       private deviceService: DeviceService,
                       private localeService: BsLocaleService,
                       private spinService: SpinService) {
    }

    bsConfig: Partial<BsDatepickerConfig> = {
        showWeekNumbers: false,
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: "theme-dark-blue"
    };
    month: any;
    device: any;
    logTable: any = []
    perPagNo: number = 50;
    pageIndex: number = 1;
    total: number = 0;
    logLine: any = [];
    maxDate: any = new Date();
    flag: any = true;

    ngOnInit(): void {
        window.addEventListener("popstate", () => {
            this.bsModalRef.hide();
        });
        this.localeService.use("zh-cn")
        this.getLine();
        let height = document.body.clientHeight;
        let topnavbarheight = jQuery(".navbar").height();
        jQuery("#modal-body").height(height - topnavbarheight - 160);
        jQuery("#parRowWraper").height(height - topnavbarheight - 160);

        window.onresize = () => {
            let height = document.body.clientHeight;
            let topnavbarheight = jQuery(".navbar").height();
            jQuery("#modal-body").height(height - topnavbarheight - 160);
            jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        };
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
        this.getdeviceLog(pageIndex)
    }

    getdeviceLog(pageIndex?) {
        let that = this;
        this.spinService.spin(true);
        let parm: any = {
            pageIndex: pageIndex ? pageIndex : 1,
            perPageNo: this.perPagNo,
            deviceId: this.device.deviceId,
            startTime: this.month ? new Date(this.formatDate(this.month[0], 1)).getTime() : "",
            endTime: this.month ? new Date(this.formatDate(this.month[1], 2)).getTime() : ""
        };
        this.deviceService.getLog(parm, res => {
            this.spinService.spin(false);
            this.logTable = res.data;
            this.total = res.totalNumbers;
        });
    }

    HSformat(ms) {
        if (ms) {
            return new Date(ms).toLocaleString();
        } else {
            return "";
        }
    }

    enterSearch(e) {
        if (e.keyCode == 13) {
            this.search();
        }
    }

    delect() {
        this.month = null;
    }

    search() {
        this.pageIndex = 1;
        this.total = 0;
        this.getdeviceLog();
    }

    formatDate(date: Date, type): any {
        if (date) {
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (type == 1) {
                return date.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + "\n" + "00" + ":" + "00";
            }
            if (type == 2) {
                return date.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + "\n" + "23" + ":" + "59";
            }
        }
        return null;
    }

    LineOptions: any = {
        view: {'device': [830, 400], 'temp': [830, 250]},
        showXAxis: true,
        showYAxis: true,
        gradient: false,
        showLegend: true,
        showXAxisLabel: false,
        xAxisLabel: {'device': '设备使用率', 'temp': '设备温度'},
        showYAxisLabel: true,
        yAxisLabel: {'device': '设备使用率', 'temp': '设备温度'},
        yScaleMax: 100,
        legendTitle: {'device': '设备使用率', 'temp': '设备温度'},
    }
    colorScheme = {
        domain: ['#5AA454', '#1635e7', '#C7B42C']
    };
    colorScheme1 = {
        domain: ['#a1290a']
    };
    single = [];
    cpuTempsingle = [];

    euroValueFormat(c): any {
        return c + '%';
    }

    euroTempFormat(c): any {
        return c + '℃';
    }

    getLine() {
        let that = this;
        this.spinService.spin(true);
        this.deviceService.getLog({"pageIndex": 1, "perPageNo": 50, deviceId: this.device.deviceId}, res => {
            this.logTable = res.data;
            this.spinService.spin(false);
            this.total = res.totalNumbers;
            let cpuTemp = {"name": 'CPU温度', 'series': []};
            let cpuUsage = {"name": 'CPU使用率', 'series': []};
            let memoryUsage = {"name": '内存使用率', 'series': []};
            let diskUsage = {"name": '硬盘使用率', 'series': []};
            res.data.forEach((el) => {
                diskUsage.series.push({
                    "name": that.HSformat(el.createTime),
                    "value": el.diskUsage ? el.diskUsage * 100 : 0
                });
                cpuUsage.series.push({
                    "name": that.HSformat(el.createTime),
                    "value": el.cpuUsage ? el.cpuUsage * 100 : 0
                });
                memoryUsage.series.push({
                    "name": that.HSformat(el.createTime),
                    "value": el.memoryUsage ? el.memoryUsage * 100 : 0
                });
                cpuTemp.series.push({
                    "name": that.HSformat(el.createTime),
                    "value": el.cpuTemp ? el.cpuTemp : 0
                });
            })
            this.logLine.push(cpuUsage);
            this.logLine.push(memoryUsage);
            this.logLine.push(diskUsage);
            this.single = this.logLine;
            this.cpuTempsingle = [cpuTemp];
        });
    }
}
