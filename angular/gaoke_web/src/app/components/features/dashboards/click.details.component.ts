import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {DashboardTimeService} from './dashboard.time.service';
import {Constants} from '../../../common/constants';

@Component({
    selector: 'atnd-dashboard-click-details',
    template: `
        <div class="panel panel-default">
            <div class="panel-heading">
                {{loginUser.unificationName}}<span *ngIf="project != undefined">-{{project.unificationName}}</span>&nbsp;共有员工&nbsp;{{userSum}}&nbsp;人,{{event?.name}}<span *ngIf="event?.name === '正常'">打卡</span>&nbsp;{{event?.value}}&nbsp;人
                <button type="button" class="close pull-right" aria-label="Close" (click)="closeRef()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="panel-body" style="height: 380px; overflow-y: auto;">
                <div class="activity-stream">
                    <table class="table table-bordered">
                        <tr>
                            <th>序号</th>
                            <th>姓名</th>
                            <th>部门</th>
                            <th *ngIf="clickType == 'clock' || clickType == 'frown'">第一次打卡时间</th>
                            <th *ngIf="clickType == 'clock' || clickType == 'bullhorn'">最后一次打卡时间</th>
                            <th *ngIf="clickType == 'frown'">迟到时长</th>
                            <th *ngIf="clickType == 'bullhorn'">早退时长</th>
                        </tr>
                        <tr *ngFor="let item of clickTimes;let idx = index;">
                            <td>{{idx + 1}}</td>
                            <td>{{item.userName}}</td>
                            <td>{{item.groupNames}}</td>
                            <td *ngIf="clickType == 'clock' || clickType == 'frown'">{{timeFormat(item.firstTime)}}</td>
                            <td *ngIf="clickType == 'clock' || clickType == 'bullhorn'">{{timeFormat(item.lastTime)}}</td>
                            <td *ngIf="clickType == 'frown'">{{item.lateHour}}</td>
                            <td *ngIf="clickType == 'bullhorn'">{{item.earlyHour}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    `
})
export class DashboardClickDetailsComponent implements OnInit {

    unificationId: any;
    clickType: string = 'frown';
    clickTimes: any[];
    event: any;
    dashboardData: any;
    project: any;
    loginUser: any;
    userSum: number = 0;
    constructor(public bsModalRef: BsModalRef, private  dashboardTimeService: DashboardTimeService) {
    }

    ngOnInit(): void {
        this.loginUser = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';
        window.addEventListener("popstate", ()=> {
            this.bsModalRef.hide();    
        });
        let name = this.event.name;
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
        let dyComponent = this;
        dyComponent.dashboardTimeService.getUserClickData({type: this.clickType, unificationId: this.unificationId}, function (result) {
            dyComponent.clickTimes = result;
        });
        dyComponent.dashboardTimeService.getUserSum({unificationId: this.unificationId},(data)=>{
            dyComponent.userSum = data
        })
    }

    closeRef() {
        this.bsModalRef.hide();
    }    

    timeFormat(ms) {
        if (ms) {
            return new Date(ms).toString().slice(16,25);;
        } else {
            return "";
        }
    }
}
