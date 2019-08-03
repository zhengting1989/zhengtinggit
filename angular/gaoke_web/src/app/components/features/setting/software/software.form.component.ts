import {BsModalRef} from 'ngx-bootstrap';
import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'atnd-setting-software-form',
    template: `
        <form class="m-t form-horizontal" role="form" name="form"
              (ngSubmit)="softwareForm.form.valid && saveSoftware()"
              #softwareForm="ngForm"
              novalidate>
            <div class="modal-header" style="margin-top: -20px;">
                <h4 class="modal-title pull-left">软件管理-{{type === 'add' ? '新增' : type === 'edit' ? '修改' : '详情'}}</h4>
                <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group" *ngIf="type != 'edit'">
                    <label class="col-sm-2 control-label">软件ID</label>
                    <div class="col-sm-10">
                        <input type="number" class="form-control" name="softwareId"
                               [(ngModel)]="data.softwareId" #softwareId="ngModel" required
                               [readonly]="type === 'detail'"
                               min="0" step="1"
                               maxlength="250"
                               placeholder="请输入软件ID"/>
                        <span class="help-block m-b-none text text-warning" *ngIf="!data?.softwareId">
                             * 软件ID为必填项
                        </span>
                        <span class="help-block m-b-none text text-danger" *ngIf="checkSoftwareId(data?.softwareId)">
                             * 软件ID为整数编码
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">软件名称</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="name"
                               [(ngModel)]="data.name" #name="ngModel" required
                               maxlength="100"
                               [readonly]="type === 'detail'"
                               (change)="data.name=data.name.trim()"
                               placeholder="请输入软件名称"/>
                        <span class="help-block m-b-none text text-warning" *ngIf="!data?.name">
                             * 软件名称为必填项
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">备注</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" name="remark"
                                  [(ngModel)]="data.remark" #remark="ngModel"
                                  onchange="this.value=this.value.substring(0, 180)"
                                  onkeydown="this.value=this.value.substring(0, 180)"
                                  onkeyup="this.value=this.value.substring(0, 180)"
                                  [readonly]="type === 'detail'"
                                  placeholder="请填写备注" style="resize: none;" rows="5" cols="120">                             
                        </textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-info"
                        *ngIf="type != 'detail'"
                        [disabled]="checkSoftware(softwareForm,data?.softwareId)">保存
                </button>
                <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">关闭</button>
            </div>
        </form>
    `
})

export class SoftwareFormComponent {

    data: any;
    type: string;
    @Output() onSubmitForm = new EventEmitter();

    constructor(public bsModalRef: BsModalRef) {
    }
    ngOnInit(): void {
        window.addEventListener("popstate", ()=> {
            this.bsModalRef.hide();    
        });
    }
    saveSoftware() {
        this.data['valid'] = true;
        this.onSubmitForm.emit(this.data);
        this.bsModalRef.hide();
    }

    checkSoftwareId(softwareId?: any) {
        if (this.type === 'detail') {
            return false;
        }
        if (softwareId && softwareId > 0) {
            let str = '#' + softwareId;
            return str.indexOf('.') > -1;
        }
        return false;
    }

    checkSoftware(softwareForm: any, softwareId: any): boolean {
        if (this.checkSoftwareId(softwareId)) {
            return true;
        }
        return !softwareForm.form.valid;
    }

}

