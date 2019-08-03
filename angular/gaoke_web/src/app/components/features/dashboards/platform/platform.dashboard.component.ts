import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {DashboardDeviceDetailsComponent} from '../device.details.component';
import {DashboardDeviceService} from '../dashboard.device.service';

@Component({
    selector: 'atnd-dashboard-platform',
    templateUrl: 'platform.dashboard.template.html'
})
export class DashboardPlatformComponent implements OnInit, OnDestroy {


    peitys: any = [];
    @Input('initDashboardData') initDashboardData: any;
    queryPeriod: string = '0h';
    bsModalRef: BsModalRef;
    options: any = {
        fill: [
            '#ff715e',
            '#d2f5a6',
            '#eedd78',
            '#ffb980',
            '#d87a80'
        ],
        innerRadius: 30,
        radius: 70,
        after: function () {
            var centre = this.scale(0, 0);
            let a = this.values()[0] * 100;
            let b = this.values()[1];
            var total = '0';
            if (b > 0) {
                total = (a / b).toFixed(0);
            }
            var line2 = this.svgElement('text', {
                fill: '#262626',
                'font-size': 18,
                'text-anchor': 'middle',
                x: centre[0],
                y: centre[1] + 8,
            }).text(total + '%');
            this.$svg.append(line2)
        }
    };
    periods: any[] = [
        {
            'key': '1080h',
            'name': '45天'
        },
        {
            'key': '720h',
            'name': '30天'
        },
        {
            'key': '240',
            'name': '10天'
        },
        {
            'key': '168h',
            'name': '1周'
        },
        {
            'key': '72h',
            'name': '72h'
        },
        {
            'key': '36h',
            'name': '36h'
        },
        {
            'key': '24h',
            'name': '24h'
        },
        {
            'key': '0h',
            'name': '实时数据',
            'current': true
        }
    ];
    dashboardPieData: any[] = [];
    interval;

    ngOnChanges() {
        if (this.initDashboardData) {
            this.dashboardPieData = this.initDashboardData.summaryPie || [];
            this.peitys = this.initDashboardData.itemsPie || [];
        }
    }

    ngOnInit(): void {
        let dyComponent = this;
        this.interval = setInterval(() => {
            dyComponent.queryData();
        }, 30000);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    constructor(private modalService: BsModalService, private dashboardDeviceService: DashboardDeviceService) {
    }

    queryData() {
        let dyComponent = this;
        dyComponent.dashboardDeviceService.callData({duration: dyComponent.queryPeriod}, function (result) {
            if (result) {
                dyComponent.dashboardPieData = result.summaryPie || [];
                dyComponent.peitys = result.itemsPie || [];
            }
        })
    }

    doQuery(period) {
        this.queryPeriod = period;
        clearInterval(this.interval);
        let dyComponent = this;
        dyComponent.queryData();
        this.interval = setInterval(() => {
            dyComponent.queryData();
        }, 30000);
    }

    goDetails(peity) {
        const initialState = {
            initialState: {
                detailType: peity.type,
                detailName: peity.name,
                duration: this.queryPeriod
            }
        };
        this.bsModalRef = this.modalService.show(DashboardDeviceDetailsComponent, initialState);
    }
}

