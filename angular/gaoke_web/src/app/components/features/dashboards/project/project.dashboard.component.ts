import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DashboardTimeService} from '../dashboard.time.service';
import {Constants} from '../../../../common/constants';

@Component({
    selector: 'atnd-dashboard-project',
    templateUrl: 'project.dashboard.template.html'
})
export class DashboardProjectComponent implements OnInit, OnDestroy {

    @Input('initDashboardData') initDashboardData: any;
    single: any[] = [];
    label: string = '合计';
    times: any[];
    clickType: string = 'frown';
    clickTypeName: string = '迟到';
    clickTimes: any[];
    interval;
    unificationId: any;
    colorScheme = {
        domain: [
            '#0a915d',
            '#eedd78',
            '#d48265',
            '#ff715e'
        ]
    };
    loginUser: any;
    event: any;
    userSum: number = 0;
    ngOnChanges() {
        if (this.initDashboardData) {
            let parentPie = this.initDashboardData.parentPie;
            this.single = parentPie ? parentPie.items || [] : [];
            this.userSum = 0;
            this.single.forEach((el)=>{
                this.userSum += el.value;
            })
            this.unificationId = parentPie ? parentPie.unificationId : null;
            this.clickTimes = this.initDashboardData.userDetails ? this.initDashboardData.userDetails || [] : [];
        }
    }

    constructor(private  dashboardTimeService: DashboardTimeService) {
    }

    percentageFormatting(c) {
        return Math.round(c);
    }

    ngOnInit(): void {
        let dyComponent = this;
        this.loginUser = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';
        let parentPie = this.initDashboardData.parentPie;
        this.single = parentPie ? parentPie.items || [] : [];
        this.userSum = 0;
        this.interval = setInterval(() => {
            dyComponent.dashboardTimeService.callData({}, function (result) {
                if (result) {
                    let parentPie = result.parentPie;
                    dyComponent.single = parentPie ? parentPie.items || [] : [];
                    dyComponent.unificationId = parentPie ? parentPie.unificationId : null;
                }
            });
            dyComponent.refresh(dyComponent.clickType);
        }, 30000);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    onSelect(event) {
        this.event = event;
        let name = event.name;
        this.clickTypeName = name;
        if (name === '正常') {
            this.clickType = 'clock';
        } else if (name === '旷工') {
            this.clickType = 'bell';
        } else if (name === '迟到') {
            this.clickType = 'frown';
        } else if (name === '早退') {
            this.clickType = 'bullhorn';
        } else {
            this.clickType = 'all';
        }
        if (event && event.value > 0) {
            this.refresh(this.clickType);
        } else {
            this.clickTimes = [];
        }
    }

    refresh(type) {
        this.clickType = type;
        let dyComponent = this;
        dyComponent.dashboardTimeService.getUserClickData({type: this.clickType, unificationId: this.unificationId}, function (result) {
            dyComponent.clickTimes = result;
        });
        dyComponent.dashboardTimeService.getUserSum({unificationId: this.unificationId},(data)=>{
            dyComponent.userSum = data
        })
    }   

    timeFormat(ms) {
        if (ms) {
            return new Date(ms).toString().slice(16,25);;
        } else {
            return "";
        }
    }
}
