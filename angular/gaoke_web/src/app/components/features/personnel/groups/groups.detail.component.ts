import {BsModalRef} from 'ngx-bootstrap';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GroupsService} from './groups.service';

@Component({
    selector: 'atnd-groups-detail',
    template: `
        <form class="m-t form-horizontal" role="form" name="form"
              (ngSubmit)="groupForm.form.valid && addGroup()"
              #groupForm="ngForm"
              novalidate>
            <div class="modal-header" style="margin-top: -20px;">
                <h4 class="modal-title pull-left">新增/修改分组</h4>
                <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="col-sm-2 control-label">操作选择</label>
                    <div class="col-sm-10">
                        <button class="btn btn-xs" type="button" read-only
                                [ngClass]="{' btn-info': classBtn == 0, 'btn-white': classBtn != 0}"
                                (click)="toChangeClassBtn(0)">
                            <i class="fa fa-edit"></i> 修改当前部门
                        </button>
                        <button class="btn btn-xs" type="button" *ngIf="addNodeBtn" hide-node
                                [ngClass]="{' btn-info': classBtn == 1, 'btn-white': classBtn != 1}"
                                (click)="toChangeClassBtn(1)">
                            <i class="fa fa-plus"></i> 新增子部门
                        </button>
                        <button class="btn btn-xs" *ngIf="!groupNode.onlyAddChildren" type="button" hide-node
                                [ngClass]="{' btn-info': classBtn == 2, 'btn-white': classBtn != 2}"
                                (click)="toChangeClassBtn(2)">
                            <i class="fa fa-plus"></i> 新增同级部门
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">组名</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="name" read-only
                               maxlength="30"
                               [(ngModel)]="group.name" #name="ngModel" required
                               (change)="group.name=group.name.trim()" placeholder="请输入组名"
                               [readonly]="classBtn == 0 && readonly"/>
                        <span class="help-block m-b-none text text-warning" *ngIf="!group?.name">
                             * 组名为必填项
                        </span>
                        <span class="help-block m-b-none text text-warning" *ngIf="group?.name && nameWarningTip">
                             * {{nameWarningTip}}
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">备注</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" name="comment" read-only  style="resize: none;"
                                  [(ngModel)]="group.comment" #comment="ngModel"
                                  (change)="group.comment=group.comment.trim()"
                                  placeholder="请填写备注" rows="5" cols="120"
                                  [readonly]="classBtn == 0 && readonly">                             
                        </textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-info" hide-node
                        *ngIf="!(classBtn == 0 && readonly)"
                        [disabled]="!groupForm.form.valid">保存
                </button>
                <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">关闭</button>
            </div>
        </form>
    `
})

export class GroupsDetailComponent implements OnInit {

    addNodeBtn: boolean = true;
    classBtn: number = 0;
    readonly: boolean;
    group: any;
    groupNode: any;
    @Output() onSubmitForm = new EventEmitter();
    nameWarningTip: string;

    ngOnInit(): void {
        this.classBtn = 0;
        this.readonly = this.groupNode.readonly;
        this.addNodeBtn = !(this.groupNode.readonly && !this.groupNode.onlyAddChildren);
        this.group = JSON.parse(JSON.stringify(this.groupNode.nodeInfo));
    }


    constructor(public bsModalRef: BsModalRef,
                private groupsService: GroupsService) {
    }

    addGroup() {
        if (!(this.classBtn == 0 && this.readonly)) {
            let backGroup = {
                method: this.classBtn == 0 ? 'PUT' : 'POST',
                group: this.group
            };
            let queryParam = {
                name: this.group.name,
                parentId: this.group.parentId
            };
            if (this.group.groupId) {
                queryParam['groupId'] = this.group.groupId;
            }
            let dyComponent = this;
            this.groupsService.checkedGroupName(queryParam, function (rseult) {
                if (rseult > 0) {
                    dyComponent.nameWarningTip = '同一父节点下的直属节点不能重名';
                } else {
                    dyComponent.onSubmitForm.emit(backGroup);
                    dyComponent.bsModalRef.hide();
                }
            })
        }
    }

    toChangeClassBtn(idx) {
        this.classBtn = idx;
        if (idx === 0) {
            this.group = JSON.parse(JSON.stringify(this.groupNode.nodeInfo));
        } else if (idx === 1) {
            this.group = {
                name: '',
                comment: '',
                parentId: this.groupNode.nodeId
            }
        } else {
            this.group = {
                name: '',
                comment: '',
                parentId: this.groupNode.parentNodeId
            }
        }
    }
}

