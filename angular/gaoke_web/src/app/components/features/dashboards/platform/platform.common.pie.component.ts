import {Component, Input} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {DashboardDeviceDetailsComponent} from '../device.details.component';

@Component({
    selector: 'atnd-dashboard-platform-common-pie',
    template: `
        <div style="height: 100%; width: 100%">
            <ngx-charts-pie-chart
                    [results]="dashboardData"
                    [scheme]="colorScheme"
                    [legend]="showLegend"
                    [legendTitle]="legendTitle"
                    [explodeSlices]="explodeSlices"
                    [labels]="showLabels"
                    [doughnut]="doughnut"
                    [gradient]="false"
                    (select)="onSelect($event)">
            </ngx-charts-pie-chart>
        </div>
    `
})
export class DashboardPlatformCommonPieComponent {

    @Input('dashboardData') dashboardData: any [];
    @Input('duration') duration: any;

    legendTitle = '设备状态';
    showLegend = true;
    showLabels = false;
    explodeSlices = false;
    doughnut = false;
    colorScheme = {
        domain: [
            '#0a915d',
            '#ff715e',
            '#eedd78' 
        ]
    };
    bsModalRef: BsModalRef;

    constructor(private modalService: BsModalService) {
    }

    onSelect(event) {
        let detailType = 'normal';
        let name = event.name;
        name = name ? name : event;
        if (name === '正常') {
            detailType = 'normal';
        } else if (name === '异常') {
            detailType = 'abnormal';
        } else if (name === '超时') {
            detailType = 'timeout';
        } else {
            detailType = 'normal';
        }
        const initialState = {
            initialState: {
                detailType: detailType,
                detailName: name,
                duration: this.duration
            }
        };
        this.bsModalRef = this.modalService.show(DashboardDeviceDetailsComponent, initialState);
    }

}
