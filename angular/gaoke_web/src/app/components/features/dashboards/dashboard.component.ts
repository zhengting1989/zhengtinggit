import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardTimeService} from './dashboard.time.service';
import {Constants} from '../../../common/constants';
import {DashboardDeviceService} from './dashboard.device.service';

declare var $: any;

@Component({
    selector: 'atnd-dashboards',
    templateUrl: 'dashboard.template.html',
    styles: ['.timebord{display:flex;}.timebord>div{border:1px solid #ccc;background:#fff;}.tile{box-shadow: rgba(35,36,37,.3) 0px 2px 4px 0;height: 75px;display: flex;align-items: center;justify-content: space-around;}.titleImg{width: 25%;display: flex;justify-content: center;}.titleText{border-left: solid 1px #0000004f;width: 75%;color:#71d398; font-size: 22px;font-weight: 600; text-align: center;}']
})
export class DashboardComponent implements OnInit, OnDestroy {

    dashboardType: string = 'platform';
    interval;
    showLoading: boolean = true;
    initDashboardData: any;
    loginUser: any;
    
    constructor(private dashboardTimeService: DashboardTimeService,
                private dashboardDeviceService: DashboardDeviceService) {
        $('#toggleSpinners').on('click', function () {
            $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
            $('#ibox2').children('.ibox-content').toggleClass('sk-loading');

        })
    }

    ngOnInit(): void {
        //解决多重选择页面未消失
        setTimeout(() => {
            var self: any = document.getElementsByTagName('modal-container')[0];
            var backdrop: any = document.getElementsByTagName('bs-modal-backdrop')[0];
            if (self) {
                var parent = self.parentElement;
                parent.removeChild(self);
                parent.removeChild(backdrop);
            }
        }, 500)
        this.getTime();
        this.weeekShow()
        setInterval(()=>{this.getTime()},1000);
        let dyComponent = this;
        let loginUser: any = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';
        this.interval = setInterval(() => {
            if (loginUser == 'loginUser') {
                loginUser = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';
            } else {
                dyComponent.loginUser = loginUser;
                let unificationType = loginUser.unificationType;
                clearInterval(this.interval);
                if ('platform' === unificationType) {
                    dyComponent.dashboardDeviceService.callData({}, function (result) {
                        dyComponent.initDashboardData = result;
                        dyComponent.dashboardType = unificationType;
                        dyComponent.showLoading = false;
                    });
                } else {
                    dyComponent.dashboardTimeService.callData({}, function (result) {
                        dyComponent.initDashboardData = result;
                        dyComponent.dashboardType = unificationType;
                        dyComponent.showLoading = false;
                    });
                }
            }
        }, 10);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    date: any = new Date().getFullYear() + "年" + Number(new Date().getMonth() + 1) + "月" + new Date().getDate() + "日";
    time: any = 'HH:MM';

    getTime() {
        let date = new Date();
        let h = date.getHours() >= 10 ? date.getHours():'0'+ date.getHours();
        let m = date.getMinutes() >= 10 ? date.getMinutes():'0'+ date.getMinutes();
        let time = h + ":" + m;
        this.time = time;
    }

    weeekShow() {
        let weekArray = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        let week = weekArray[new Date().getDay()];
        return week;
    }
}
