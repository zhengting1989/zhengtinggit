import {Component, Input} from '@angular/core';

@Component({
    selector: 'atnd-dashboard-property-bar',
    template: `
        <div style="height: 380px; width: 100%">
            <ngx-charts-bar-vertical
                    [results]="dashboardData"
                    [gradient]="gradient"
                    [xAxis]="showXAxis"
                    [yAxis]="showYAxis"
                    [showXAxisLabel]="showXAxisLabel"
                    [showYAxisLabel]="showYAxisLabel"
                    [showDataLabel]="true"
                    [xAxisLabel]="xAxisLabel"
                    [yScaleMax]="100"
                    [scheme]="colorScheme"
                    [yAxisLabel]="yAxisLabel">
            </ngx-charts-bar-vertical>
        </div>
    `
})
export class DashboardPropertyBarComponent {

    @Input('dashboardData') dashboardData: any [];
    
    ngOnChanges() {
        if(this.dashboardData.length == 0){
            this.showXAxisLabel = false;
        }else{
            this.showXAxisLabel = true;
        };
    };

    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showXAxisLabel = true;
    xAxisLabel = '各项目名称';
    showYAxisLabel = true;
    yAxisLabel = '正常打卡占比（%）';
    colorScheme = {
        domain: [
            '#516b91',
            '#8c6ac4',
            '#001852',
            '#f5e8c8',
            '#b8d2c7',
            '#c6b38e',
            '#a4d8c2',
            '#f3d999',
            '#d3758f',
            '#dcc392',
            '#2e4783',
            '#82b6e9',
            '#a092f1',
            '#eaf889',
            '#6699FF',
            '#d5b158',
            '#38b6b6',
            '#9b8bba',
            '#e098c7',
            '#8fd3e8',
            '#71669e',
            '#cc70af',
            '#7cb4cc',
            '#2ec7c9',
            '#b6a2de',
            '#5ab1ef',
            '#ffb980',
            '#d87a80',
            '#8d98b3',
            '#e5cf0d',
            '#97b552',
            '#95706d',
            '#dc69aa',
            '#07a2a4',
            '#9a7fd1',
            '#588dd5',
            '#f5994e',
            '#c05050',
            '#59678c',
            '#c9ab00',
            '#7eb00a',
            '#6f5553'
        ]
    };
}
