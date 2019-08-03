import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {SoftwareService} from './software.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {SoftwareFormComponent} from './software.form.component';


@Component({
    selector: 'atnd-setting-software',
    template: `
        <div class="wrapper wrapper-content">
            <div class="row white-bg" style="margin-top: -5px !important;margin-bottom: 50px !important;">
                <div class="col-sm-12" style="margin-top: 2px " hide-node>
                    <button class=" btn btn-primary btn-bitbucket"
                            (click)="openModel()"
                            style="border-radius:3px;">
                        <i class="fa fa-plus"></i>&nbsp;新增
                    </button>
                </div>
                <div class="col-sm-12">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th> 软件ID</th>
                            <th> 软件名称</th>
                            <th> 备注</th>
                            <th> 操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr *ngFor="let software of softwares;">
                            <td> {{software?.softwareId}}</td>
                            <td> {{software?.name}}</td>
                            <td> {{software?.remark}}</td>
                            <td>
                                <button class="btn btn-sm btn-info" style="margin-right: 2px;"
                                        type="button" (click)="openModel(software,'detail')">
                                    <i class="fa fa-eye"></i>&nbsp;详情
                                </button>
                                <button class="btn btn-sm btn-white" style="margin-right: 2px;"
                                        type="button" (click)="openModel(software,'edit')"
                                        hide-node >
                                    <i class="fa fa-edit"></i>&nbsp;修改
                                </button>
                            </td>
                        </tr>
                        </tbody>
                        <tbody>
                        <tr *ngIf="softwares.length == 0">
                            <td colspan="100%" class="text-center">没有记录!</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    styles: ['.span{display: inline-block ;width: 34px;margin: 0 5px;height: 34px;line-height: 29px;}.time{display: flex;align-items: center;justify-content: center;}']
})
export class SoftwareComponent implements OnInit {

    ngOnInit(): void {
        this.getRestDatas();
    }

    softwares: any[] = [];
    bsModalRef: BsModalRef;

    public constructor(private softwareService: SoftwareService,
                       private modalService: BsModalService) {
    }

    getRestDatas() {
        let softwareComponent = this;
        this.softwareService.getData({}, function (resilt) {
            softwareComponent.softwares = resilt || [];
        });
    }

    openModel(data?: any, type?: string) {
        if (type) {
            const initialState = {
                initialState: {
                    type: type,
                    data: JSON.parse(JSON.stringify(data))
                }
            };
            let thisComponent = this;
            this.bsModalRef = this.modalService.show(SoftwareFormComponent, initialState);
            this.bsModalRef.content.onSubmitForm
                .subscribe((formData) => {
                    thisComponent.softwareService.updateData(formData, function (result) {
                        thisComponent.getRestDatas();
                    });
                });
        } else {
            const initialState = {
                initialState: {
                    type: 'add',
                    data: {softwareId: null, name: null, remark: null}
                }
            };
            let thisComponent = this;
            this.bsModalRef = this.modalService.show(SoftwareFormComponent, initialState);
            this.bsModalRef.content.onSubmitForm
                .subscribe((formData) => {
                    thisComponent.softwareService.addData(formData, function (result) {
                        thisComponent.getRestDatas();
                    });
                });
        }
    }

}
