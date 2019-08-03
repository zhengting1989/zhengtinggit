import {Component, Input} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {DashboardClickDetailsComponent} from '../click.details.component';

@Component({
    selector: 'atnd-dashboard-property-common-pie',
    template: `
        <div style="height: 100%; width: 100%">
            <ngx-charts-advanced-pie-chart
                    [results]="dashboardData"
                    [label]="label"
                    [scheme]="colorScheme"
                    (select)="onSelect($event)"
                    [percentageFormatting]="percentageFormatting"
                   >
            </ngx-charts-advanced-pie-chart>
        </div>
    `
})
export class DashboardPropertyCommonPieComponent {

    @Input('dashboardData') dashboardData: any [];
    @Input('unificationId') unificationId: any;
    @Input('project') project: any;
    label: string = '合计';
    colorScheme = {
        domain: [
            '#0a915d',
            '#eedd78',
            '#d48265',
            '#ff715e'
        ]
    };
    bsModalRef: BsModalRef;

    constructor(private modalService: BsModalService) {
    }

    percentageFormatting(c) {
        return Math.round(c);
    }

    onSelect(event) {
        if (event && event.value > 0) {
            const initialState = {
                initialState: {
                    event: event,
                    unificationId: this.unificationId,
                    dashboardData: this.dashboardData,
                    project: this.project
                }
            };
            this.bsModalRef = this.modalService.show(DashboardClickDetailsComponent, initialState);
        }
    }

}
