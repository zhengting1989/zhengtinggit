import {Component, OnDestroy, OnInit} from '@angular/core';
import {UnificationsService} from './unifications.service';
import {DynamicTableOption} from '../../../../common/components/dynamicTable/dynamic.table.option';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {UnificationsDetailComponent} from './unifications.detail.component';
import {Constants} from '../../../../common/constants';

@Component({
    selector: 'atnd-setting-unifications',
    templateUrl: 'unifications.template.html',
    styleUrls: ['./unifications.template.scss']
})
export class UnificationsComponent implements OnInit, OnDestroy {
    interval;
    propertys: any;
    unificationType: string;
    columns = [
        {
            type: 'list',
            name: '账号类别',
            value: 'unificationType',
            formatter: function (value) {
                if (value === 'property') {
                    return '物业';
                } else if (value === 'platform') {
                    return '平台';
                } else if (value === 'project') {
                    return '项目';
                } else {
                    return '未知';
                }
            },
            orderBy: 'DESC'
        },
        {
            type: 'text',
            name: '所属物业',
            value: 'parentUnificationName',
            detailShowValue: 'project'
        },
        {
            type: 'text',
            name: '账号名称',
            value: 'unificationName',
            orderBy: 'DESC'
        },
        {
            type: 'text',
            name: '所在地',
            value: 'address',
            orderBy: 'DESC'
        },
        {
            type: 'text',
            name: '账号简称',
            value: 'shortName',
            orderBy: 'DESC'
        },
        {
            type: 'text',
            name: '联系人',
            value: 'contactName',
            orderBy: 'DESC'
        },
        {
            type: 'text',
            name: '联系方式',
            value: 'contactPhone',
            orderBy: 'DESC'
        },
        {
            type: 'image',
            name: '账号图标',
            value: 'faIcon',
            hidden: true
        }
    ];
    tableOption: DynamicTableOption = {
        detailBtn: true,
        searchBtn: true,
        globalMethods: [
            {
                type: 'add',
                label: '添加',
                faIcon: 'fa fa-plus',
                class: 'btn btn-primary btn-bitbucket',
                access: true
            }
        ],
        singleMethods: [
            {
                type: 'update',
                label: '修改',
                faIcon: 'fa fa-edit',
                class: 'btn btn-sm btn-white',
                access: true
            }
        ],
        searchPlaceholder:'请按照关键字(帐号类别/名称/所在地/简称/联系人/联系方式)进行搜索'
    };
    unificationModalRef: BsModalRef;
    queryParam: any;

    public constructor(public unificationsService: UnificationsService,
                       private modalService: BsModalService) {

    }

    ngOnInit(): void {
        let dyComponent = this;
        let loginUser: any = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';
        this.interval = setInterval(() => {
            if (loginUser == 'loginUser') {
                loginUser = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';
            } else {
                dyComponent.unificationType = loginUser.unificationType;
                clearInterval(this.interval);
                if (loginUser.unificationType === 'project') {
                    dyComponent.tableOption.globalMethods = [];
                    dyComponent.tableOption.searchBtn = false;
                } else if (loginUser.unificationType === 'platform') {
                    dyComponent.getPropertys();
                }
            }
        }, 10);

    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    singleCallback(event) {
        let isUpdate: boolean = event.singleMethod.type === 'update';
        const initialState = {
            initialState: {
                propertys: this.propertys,
                unificationInfo: isUpdate ? JSON.parse(JSON.stringify(event.data)) : {unificationType: 'property'},
                isUpdate: isUpdate,
                type: this.unificationType
            }
        };
        let thisComponent = this;
        this.unificationModalRef = this.modalService.show(UnificationsDetailComponent, initialState);
        this.unificationModalRef.content.onSubmitForm
            .subscribe((formData) => {
                if (isUpdate) {
                    thisComponent.unificationsService.updateData(formData, function (result) {
                        thisComponent.queryParam = {
                            queryTime: new Date()
                        }
                    })
                } else {
                    thisComponent.unificationsService.addData(formData, function (result) {
                        thisComponent.queryParam = {
                            queryTime: new Date()
                        };
                        if (formData.unificationType === 'property') {
                            thisComponent.getPropertys();
                        }
                    })
                }
            });
    }
    //unificationType 挑选需要展示unification的类型【null(所有),notPlatform(非platform),platform,property,project】,默认null
    getPropertys() {
        let thisComponent = this;
        thisComponent.unificationsService.getDataList({unificationType: 'property'}, function (result) {
            thisComponent.propertys = result;
        });
    }
}
