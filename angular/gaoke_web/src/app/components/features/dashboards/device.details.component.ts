import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {DashboardDeviceService} from './dashboard.device.service';

@Component({
    selector: 'atnd-dashboard-device-details',
    template: `
        <div class="panel panel-default">
            <div class="panel-heading">
                【{{detailName}}】设备记录&nbsp;&nbsp;
                <button type="button" class="close pull-right" aria-label="Close" (click)="closeRef()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="panel-body" style="height: 380px; overflow-y: auto;">
                <table class="table table-bordered">
                    <thead>
                    <tr class="normal">
                        <th>所属机构</th>
                        <th>安装地址</th>
                        <th>设备SN</th>
                        <th>设备类型</th>
                        <th>说明</th>
                        <th>时间</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let item of deviceDetails">
                        <td>{{item.unificationName}}</td>
                        <td>{{item.location}}</td>
                        <td>{{item.deviceSn}}</td>
                        <td>{{item.deviceType}}</td>
                        <td>{{item.reason}}</td>
                        <td>{{item.time}}</td>
                    </tr>
                    <tr *ngIf="!deviceDetails || deviceDetails.length==0">
                        <td colspan="100%" class="text-center">没有记录!</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
})
export class DashboardDeviceDetailsComponent implements OnInit {

    duration: string;
    detailName: string;
    detailType: string = 'normal';
    deviceDetails: any[];

    constructor(public bsModalRef: BsModalRef, private dashboardDeviceService: DashboardDeviceService) {
    }

    ngOnInit(): void {
        
      window.addEventListener("popstate", ()=> {
        this.bsModalRef.hide();    
    });
        let dyComponent = this;
        this.dashboardDeviceService.getDeviceDetailsData({type: this.detailType, duration: this.duration}, function (result) {
            dyComponent.deviceDetails = result || [];
        })
    }

    closeRef() {
        this.bsModalRef.hide();
    }
}
