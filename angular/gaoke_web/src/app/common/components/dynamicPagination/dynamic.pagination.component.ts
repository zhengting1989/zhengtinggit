import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'atnd-dynamic-pagination',
    template: `
        <div style="width: 100%;">
            <pagination previousText="&lsaquo;"
                        nextText="&rsaquo;"
                        firstText="&laquo;"
                        lastText="&raquo;"
                        [boundaryLinks]=true
                        [totalItems]="total"
                        [directionLinks]=true
                        [maxSize]="maxNoOfPages"
                        [itemsPerPage]="perPageNo"
                        [ngModel]="currentPage"
                        (pageChanged)="pageChanged($event.page)"
                        style="float: left; margin-top: -20px; margin-bottom: -15px;">
            </pagination>
            <div style="float: right;">
                <select (change)="onPerPageChange($event.target.value)"  [ngModel]="perPageNo">
                    <option *ngFor="let option of noOfPerPages"
                            [value]="option.value">{{ option.value }}
                    </option>
                </select>
                <span>条/页( 共 <strong> {{total}} </strong> 条 )</span>
            </div>
        </div>
    `
})
export class DynamicPaginationComponent implements OnInit {

    currentPage: number = 1;
    noOfPerPages = [{value: 10}, {value: 20}, {value: 50}, {value: 100}];
    @Input() maxNoOfPages: number = 5;
    @Input() perPageNo: number = this.noOfPerPages[0].value;
    @Input() total;
    @Output() onChanged = new EventEmitter();

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
    }

    pageChanged(page?: number): void {
        if (page) {
            this.currentPage = page;
        }
        if (this.total != 0) {
            this.onChanged.emit({pageIndex: this.currentPage, perPageNo: this.perPageNo, perPageChange: false});
        }
        this.changeDetectorRef.detectChanges();
    }

    onPerPageChange(noOfPerPage: number): void {
        this.total = 0;
        this.changeDetectorRef.detectChanges();
        this.onChanged.emit({pageIndex: 1, perPageNo: Number(noOfPerPage), perPageChange: true});
    }


}
