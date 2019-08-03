import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DashboardTimeService} from '../dashboard.time.service';

@Component({
    selector: 'atnd-dashboard-property',
    templateUrl: 'property.dashboard.template.html'
})
export class DashboardPropertyComponent implements OnInit, OnDestroy {

    @Input('initDashboardData') initDashboardData: any;
    projects: any[] = [];
    single: any[] = [];
    items: any[] = [];
    interval;
    unificationId: any;

    ngOnChanges() {
        if (this.initDashboardData) {
            let parentPie = this.initDashboardData.parentPie;
            this.single = parentPie ? parentPie.items || [] : [];
            this.unificationId = parentPie ? parentPie.unificationId : null;
            let parentBar = this.initDashboardData.parentBar;
            this.items = parentBar ? parentBar.items || [] : [];
            let childPies = this.initDashboardData.childPies;
            this.projects = childPies || [];
        }
    }

    constructor(private dashboardTimeService: DashboardTimeService) {
    }

    ngOnInit(): void {
        let dyComponent = this;
        this.interval = setInterval(() => {
            dyComponent.dashboardTimeService.callData({}, function (result) {
                if (result) {
                    let parentPie = result.parentPie;
                    dyComponent.single = parentPie ? parentPie.items || [] : [];
                    let parentBar = result.parentBar;
                    dyComponent.items = parentBar ? parentBar.items || [] : [];
                    dyComponent.unificationId = parentPie ? parentPie.unificationId : null;
                    let childPies = result.childPies;
                    dyComponent.projects = childPies || [];
                }
            })
        }, 30000);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }
}