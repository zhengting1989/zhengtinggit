import {BsModalRef} from 'ngx-bootstrap';
import {Component, OnInit} from '@angular/core';
import {AboutService} from './about.service';

@Component({
    selector: 'atnd-about-detail',
    template: `
        <div class="modal-header">
            <h4 class="modal-title pull-left">全属性配置表</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="stream-small" *ngFor="let config of configs;">
                <span class="label label-default"> {{config?.label}}</span>
                <span class="text-muted"><strong>key</strong>&nbsp;:&nbsp;{{config?.key}}</span>
                &nbsp;&nbsp;<strong>属性值</strong>&nbsp;:&nbsp;{{config?.value}}
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">关闭</button>
        </div>
    `
})

export class AboutDetailComponent implements OnInit {

    configs: any = [];

    ngOnInit(): void {
        let dyComponent = this;
        this.aboutService.getListData(function (result) {
            dyComponent.configs = result || [];
        })
        window.addEventListener("popstate", ()=> {
            this.bsModalRef.hide();    
        });
    }

    constructor(public bsModalRef: BsModalRef, private aboutService: AboutService) {
    }
}

