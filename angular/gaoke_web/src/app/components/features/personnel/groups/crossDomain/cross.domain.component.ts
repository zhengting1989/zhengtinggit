import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SpinService} from '../../../../../common/spin/spin.service';
import {DynamicTableOption} from '../../../../../common/components/dynamicTable/dynamic.table.option';
import {CrossDomainService} from './cross.domain.service';
import {GroupUserOperateConfirmComponent} from '../groupUsers/group.user.operate.confirm.component';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';

@Component({
    selector: 'atnd-groups-cross-domain',
    template: `
        <div class="row" *ngIf="haveCrossDomain">
            <atnd-dynamic-table
                    [columns]="columns"
                    [tableOption]="tableOption"
                    [checkBox]="true"
                    [queryParam]="queryParam"
                    [commonTableService]="crossDomainService"
                    (singleCallback)="singleCallback($event)"
                    [perPageNo]="50">
            </atnd-dynamic-table>
        </div>
        <div class="row" *ngIf="!haveCrossDomain">
            <div class="col-sm-3"></div>
            <div class="col-sm-6 text-center widget navy-bg p-xl animated wobble" style="border-radius: 15px / 20px!important;">
                <h1>
                    内置分组
                </h1>
                <ul class="list-unstyled m-t-md">
                    <li>
                        <span class="fa fa-bell"></span>
                        <label> 内置分组不提供人员跨组织管理</label>
                    </li>
                </ul>
            </div>
            <div class="col-sm-3"></div>
        </div>
    `
})
export class CrossDomainComponent implements OnInit {
    tableOption: DynamicTableOption = {
        hideWorkbench: true,
        searchBtn: true,
        globalMethods: [
            {
                type: 'add',
                label: '添加',
                faIcon: 'fa fa-plus',
                class: 'btn btn-primary btn-bitbucket',
                access: true,
                checkboxUsed: true
            }
        ],
        searchPlaceholder:'请按照关键字(登录帐号/姓名/联系方式)进行搜索'
    };
    @Input('nodeModel') nodeModel: any;
    @Output('userChange') userChange = new EventEmitter();
    @Input('changeDate') changeDate: any;

    columns = [
        {
            name: '隶属组织',
            value: 'unificationName'
        },
        {
            name: '所在分组',
            value: 'groupNames'
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
            name: '状态',
            value: 'status',
            formatter: function (value) {
                return value ? '<span class="label label-primary">在职</span>' : '<span class="label label-warning">离职</span>';
            }
        }
    ];
    queryParam: any;
    haveCrossDomain: boolean = true;
    operateConfirmModalRef: BsModalRef;

    public constructor(public crossDomainService: CrossDomainService,
                       private modalService: BsModalService,
                       private spinService: SpinService) {
    }

    ngOnInit(): void {
    }


    ngOnChanges() {
        if (this.nodeModel) {
            this.haveCrossDomain = !(this.nodeModel.readonly && !this.nodeModel.onlyAddChildren);
            this.queryParam = {
                groupId: this.nodeModel.nodeId,
                queryDate: new Date()
            }
        }
    }

    singleCallback(event) {
        const initialState = {
            initialState: {
                selectedUsers: event.data,
                isPlus: true,
                nodeModel: this.nodeModel
            }
        };
        let thisComponent = this;
        this.operateConfirmModalRef = this.modalService.show(GroupUserOperateConfirmComponent, initialState);
        this.operateConfirmModalRef.content.onConfirm
            .subscribe((payload) => {
                thisComponent.spinService.spin(true);
                thisComponent.crossDomainService.addUserToGroup(payload, function (result) {
                    thisComponent.queryParam = {
                        groupId: thisComponent.nodeModel.nodeId,
                        queryDate: new Date()
                    };
                    thisComponent.userChange.emit({changeDate: new Date()});
                    thisComponent.spinService.spin(false);
                })
            });
    }

}

