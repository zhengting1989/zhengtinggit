import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupUserService} from './group.user.service';
import {DynamicTableOption} from '../../../../../common/components/dynamicTable/dynamic.table.option';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {GroupUserOperateConfirmComponent} from './group.user.operate.confirm.component';
import {SpinService} from '../../../../../common/spin/spin.service';
import {Constants} from '../../../../../common/constants';

@Component({
    selector: 'atnd-groups-user',
    template: `
        <div class="row">
            <div [ngClass]="{'col-sm-9': checkBox, 'col-sm-12': !checkBox}">
                <div class="input-group">
                    <div class="input-group-btn">
                        <button class="btn btn-white" type="button"
                                (click)="changeNonMember(false)" [ngClass]="{'btn-primary':!nonMember}">
                            当前部门人员
                        </button>
                        <button class="btn btn-white" type="button" [ngClass]="{'btn-primary':nonMember}"
                                (click)="changeNonMember(true)">
                            非当前部门人员
                        </button>
                    </div>
                    <input type="text" placeholder="请按照关键字(员工号/登录名/姓名)进行搜索"
                           class="form-control"
                           [(ngModel)]="keyWords"
                           (keypress)="searchByKeywords($event)">
                    <span class="input-group-btn">
                        <button type="button"
                                class="btn btn-primary"
                                (click)="toSearch()">
                            <i class="fa fa-search"></i>&nbsp;搜索
                        </button>
                    </span>
                </div>
            </div>
            <div [ngClass]="{'col-sm-3 m-b-xs': checkBox, '': !checkBox}">
                <button type="button"
                        class="btn btn-warning btn-bitbucket"
                        *ngIf="!nonMember&&checkBox" hide-node
                        (click)="showOperateConfirm(false)"
                        [disabled]="selectedUsers.length == 0">
                    <i class="fa fa-trash-o"></i>&nbsp;从当前部门移除
                </button>
                <button type="button"
                        class="btn btn-info btn-bitbucket"
                        *ngIf="nonMember&&checkBox" hide-node
                        (click)="showOperateConfirm(true)"
                        [disabled]="selectedUsers.length == 0">
                    <i class="fa fa-plus"></i>&nbsp;添加到当前部门
                </button>
            </div>
            <atnd-dynamic-table
                    [columns]="columns"
                    [tableOption]="tableOption"
                    [queryParam]="queryParam"
                    [checkBox]="checkBox"
                    [perPageNo]="50"
                    [commonTableService]="groupUserService"
                    (checkboxClick)="checkboxClick($event)">
            </atnd-dynamic-table>
        </div>
    `,
    styles:['.btn-primary{color: #fff;}']
})
export class GroupUserComponent implements OnInit {
    ngOnInit(): void {
    }

    checkBox: boolean = Constants.access;
    nonMember: boolean = false;
    keyWords: string;
    queryParam: any;
    @Input('nodeModel') nodeModel: any;
    @Input('changeDate') changeDate: any;
    @Output('userChange') userChange = new EventEmitter();
    columns = [
        {
            name: '员工号',
            value: 'userNo'
        },
        {
            name: '登录名',
            value: 'loginId'
        },
        {
            name: '姓名',
            value: 'userName'
        },
        {
            name: '用户身份',
            value: 'admin',
            formatter: function (value) {
                return value ? '管理员' : '普通员工';
            }
        },
        {
            name: '是否锁定',
            value: 'locked',
            formatter: function (value) {
                return value ? '<span class="label label-warning">锁定</span>' : '<span class="label label-primary">不锁定</span>';
            }
        },
        {
            name: '状态',
            value: 'status',
            formatter: function (value) {
                return value ? '<span class="label label-primary">在职</span>' : '<span class="label label-warning">离职</span>';
            }
        }
    ];
    tableOption: DynamicTableOption = {
        hideWorkbench: true
    };
    selectedUsers: any = [];
    operateConfirmModalRef: BsModalRef;

    public constructor(public groupUserService: GroupUserService,
                       private modalService: BsModalService,
                       private spinService: SpinService) {

    }

    ngOnChanges() {
        if (this.nodeModel) {
            this.checkBox = false;
            if(Constants.access){
                this.checkBox = !(this.nodeModel.readonly && !this.nodeModel.onlyAddChildren);
            }
            this.nonMember = false;
            this.keyWords = '';
            this.queryParam = {
                groupId: this.nodeModel.nodeId,
                nonMember: this.nonMember,
                groupUserKeywords: this.keyWords,
                queryDate: new Date()
            }
        }
    }

    changeNonMember(e) {
        this.nonMember = e;
        this.queryParam = {
            groupId: this.nodeModel.nodeId,
            nonMember: this.nonMember,
            groupUserKeywords: this.keyWords,
            queryDate: new Date()
        }
    }

    toSearch() {
        this.queryParam = {
            groupId: this.nodeModel.nodeId,
            nonMember: this.nonMember,
            groupUserKeywords: this.keyWords,
            queryDate: new Date()
        }
    }

    checkboxClick(event) {
        this.selectedUsers = event || [];
    }

    searchByKeywords(event) {
        // 回车事件和点击搜索按钮触发搜索
        if (event) {
            var code = (event.keyCode ? event.keyCode : event.which);
            if (code != 13) {
                return;
            }
        }
        this.queryParam = {
            groupId: this.nodeModel.nodeId,
            nonMember: this.nonMember,
            groupUserKeywords: this.keyWords,
            queryDate: new Date()
        }
    }

    showOperateConfirm(isPlus: boolean) {
        const initialState = {
            initialState: {
                selectedUsers: this.selectedUsers,
                isPlus: isPlus,
                nodeModel: this.nodeModel
            }
        };
        let thisComponent = this;
        this.operateConfirmModalRef = this.modalService.show(GroupUserOperateConfirmComponent, initialState);
        this.operateConfirmModalRef.content.onConfirm
            .subscribe((payload) => {
                thisComponent.spinService.spin(true);
                if (isPlus) {
                    thisComponent.groupUserService.addUserToGroup(payload, function (result) {
                        thisComponent.queryParam = {
                            groupId: thisComponent.nodeModel.nodeId,
                            nonMember: thisComponent.nonMember,
                            groupUserKeywords: thisComponent.keyWords,
                            queryDate: new Date()
                        };
                        thisComponent.userChange.emit({changeDate: new Date()});
                        thisComponent.spinService.spin(false);
                    })
                } else {
                    thisComponent.groupUserService.deleteUserFromGroup(payload, function (result) {
                        thisComponent.queryParam = {
                            groupId: thisComponent.nodeModel.nodeId,
                            nonMember: thisComponent.nonMember,
                            groupUserKeywords: thisComponent.keyWords,
                            queryDate: new Date()
                        };
                        thisComponent.userChange.emit({changeDate: new Date()});
                        thisComponent.spinService.spin(false);
                    })
                }
            });
    }

}

