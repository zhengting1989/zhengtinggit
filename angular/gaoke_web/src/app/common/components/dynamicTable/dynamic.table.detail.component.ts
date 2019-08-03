import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
    selector: 'atnd-dynamic-table-detail',
    template: `
        <div class="modal-header"><h4 class="modal-title pull-left">{{title}}</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()"><span
                    aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">
            <form class="form-horizontal">
                <ng-container *ngFor="let column of columns">
                    <div class="form-group" *ngIf="detailShow(column)">
                        <label class="col-sm-2 control-label">{{column.name}}</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control"
                                   id="{{column.attributeKey}}"
                                   name="{{column.attributeKey}}"
                                   value="{{column.defaultValue?column.defaultValue:''}}"
                                   readonly
                                   *ngIf="column.type != 'image'"
                            >
                            <img [src]="'data:image/jpg;base64,' + column.defaultValue"
                                 class="img-rounded img-md" *ngIf="column.type == 'image'">
                        </div>
                    </div>
                </ng-container>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">关闭</button>
        </div>
    `
})
export class DynamicTableDetailComponent implements OnInit {

    title: string;
    columns: any;

    constructor(public bsModalRef: BsModalRef) {
    }

    ngOnInit() {
        window.addEventListener("popstate", ()=> {
            this.bsModalRef.hide();    
        });
    }

    detailShow(column) {
        if (column.detailShowValue) {
            return column.defaultValue;
        }
        return true;
    }
}
