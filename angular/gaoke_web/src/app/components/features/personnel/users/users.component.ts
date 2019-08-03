import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupsService} from '../groups/groups.service';
import {UsersService} from './users.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {UsersDetailComponent} from './users.detail.component';
import {DynamicTableOption} from '../../../../common/components/dynamicTable/dynamic.table.option';
import {UsersFormComponent} from './users.form.component';
import {Constants} from '../../../../common/constants';
import {UsersUploadComponent} from './users.upload.component';
import {SpinService} from '../../../../common/spin/spin.service';
import {AlertService} from '../../../../common/alert.service';
import {NativeToastrService} from '../../../../common/native.toastr.service';

declare var jQuery: any;

@Component({
    selector: 'atnd-personnel-users',
    templateUrl: 'users.template.html',
    styleUrls: ['./users.template.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
        clearInterval(this.unificationInterval);
    }

    checkBox: boolean = Constants.access;
    queryParam: any = {};
    groupNodes: any = [];
    filterComment: string;
    columns = [
        {
            name: '登录账号',
            value: 'loginId'
        },
        {
            name: '姓名',
            value: 'userName',
            orderBy: 'DESC'
        },
        {
            name: '性别',
            value: 'sex',
            formatter: function (value) {
                return value ? '男' : '女';
            }
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
                return value ? '锁定' : '不锁定';
            }
        },
        {
            name: '左手',
            value: 'enterLeftHand',
            formatter: function (value) {
                return value ? '<span class="label label-primary">已录入</span>' : '<span class="label label-danger">未录入</span>';
            }
        },
        {
            name: '右手',
            value: 'enterRightHand',
            formatter: function (value) {
                return value ? '<span class="label label-primary">已录入</span>' : '<span class="label label-danger">未录入</span>';
            }
        },
        {
            name: '状态',
            value: 'status',
            formatter: function (value) {
                return value ? '<span class="label label-primary">在职</span>' : '<span class="label label-warning">离职</span>';
            }
        },
        {
            name: '是否打卡',
            value: 'clockIn',
            formatter: function (value) {
                return value ? '<span class="label label-primary">是</span>' : '<span class="label label-warning">否</span>';
            }
        }
    ];
    nodeModel: any;
    options: any = {
        allowDrag: true
    };
    childNodeUser: boolean = false;

    tableOption: DynamicTableOption = {
        delBtn: true,
        searchBtn: true,
        singleMethods: [
            {
                type: 'update',
                label: '修改',
                faIcon: 'fa fa-edit',
                class: 'btn btn-sm btn-white',
                access: true
            },
            {
                type: 'detail',
                label: '详情',
                faIcon: 'fa fa-eye',
                class: 'btn btn-sm btn-info'
            }
        ],
        globalMethods: [
            {
                type: 'add',
                label: '新增',
                faIcon: 'fa fa-plus',
                class: 'btn btn-primary btn-bitbucket',
                access: true
            }
        ],
        deleteMessage: '确认删除选中的用户？此操作将删除所选中用户的同时，移除与之相关【包括：设备授权】的所有信息！',
        searchPlaceholder: '请按照关键字(登录帐号/姓名/联系方式)进行搜索'
    };
    checkboxValue: boolean = false;

    public constructor(private groupsService: GroupsService,
                       public usersService: UsersService,
                       private modalService: BsModalService,
                       private spinService: SpinService,
                       private alertService: AlertService,
                       private nativeToastrService: NativeToastrService) {

    }

    onChangeAllCheckBox(checked, tree) {
        this.checkboxValue = checked;
        this.nodeModel = undefined;
        this.onInitialized(tree);
    }

    unificationInterval;
    unificationType: string;
    unificationName: string;

    intervalUnificationType() {
        let dyComponent = this;
        let loginUser: any = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';
        this.unificationInterval = setInterval(() => {
            if (loginUser == 'loginUser') {
                loginUser = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';
            } else {
                dyComponent.unificationType = loginUser.unificationType;
                dyComponent.unificationName = loginUser.unificationName;
                clearInterval(dyComponent.unificationInterval);
            }
        }, 10);
    }

    ngOnInit(): void {
        this.movewidth();
        let height = document.body.clientHeight;
        let topnavbarheight = jQuery('.navbar').height();
        jQuery('#parRowWraper').height(height - topnavbarheight - 160);
        window.onresize = () => {
            let height = document.body.clientHeight;
            let topnavbarheight = jQuery('.navbar').height();
            jQuery('#parRowWraper').height(height - topnavbarheight - 160);
        };
        this.intervalUnificationType();
    }
    iscollFlag:any=true;
    iscollapse:any="全部展开";
    isCollapse(tree){
         this.iscollFlag = !this.iscollFlag;
         if(this.iscollFlag){
            tree.treeModel.collapseAll();
            this.iscollapse="全部展开";
        }else{
            tree.treeModel.expandAll();
            this.iscollapse="全部合并";
        }
    }
    
    onInitialized(tree) {
        let thisComponent = this;
        this.spinService.spin(true);
        this.groupsService.getGroupTree({showChildUnification: this.checkboxValue}, function (result) {
            thisComponent.groupNodes = result || [];
            if (thisComponent.groupNodes && thisComponent.groupNodes.length > 0) {
                thisComponent.nodeModel = thisComponent.groupNodes[0];
                thisComponent.queryParam = {
                    groupId: thisComponent.nodeModel.nodeId,
                    childNodeUser: thisComponent.childNodeUser,
                    queryTime: new Date()
                };
                thisComponent.spinService.spin(false);
                setTimeout(() => {
                    tree.treeModel.collapseAll();
                    tree.treeModel.getNodeById(thisComponent.groupNodes[0].id)
                        .setActiveAndVisible();
                    let panelheight = jQuery('#panel-heading').height();
                    jQuery('.height-fullbody').css({'height': 'calc(100% - ' + panelheight + 'px - 20px)'});
                });
            }
        })
    }

    onEvent(event) {
        this.nodeModel = event.node.data;
        let nodeId = this.nodeModel.nodeId;
        this.queryParam = {
            groupId: nodeId,
            childNodeUser: this.childNodeUser,
            queryTime: new Date()
        };
    }

    refreshUsers() {
        this.childNodeUser = !this.childNodeUser;
        this.queryParam = {
            groupId: this.nodeModel.nodeId,
            childNodeUser: this.childNodeUser,
            queryTime: new Date()
        };
    }

    showNodeType(): string {
        let nodeTypeTitle = '';
        if (!this.nodeModel) {
            return nodeTypeTitle;
        }
        let nodeType = this.nodeModel.nodeType;
        switch (nodeType) {
            case 'group':
                nodeTypeTitle = '部门';
                break;
            case 'property':
                nodeTypeTitle = '物业';
                break;
            case 'platform':
                nodeTypeTitle = '平台';
                break;
            case 'project':
                nodeTypeTitle = '项目';
                break;
            default:
                nodeTypeTitle = '未知';
                break;
        }
        return nodeTypeTitle;
    }

    bsModalRef: BsModalRef;

    singleCallback(event) {
        let methodType = event.singleMethod.type;
        if (methodType === 'add') {
            const initialState = {
                initialState: {
                    isUpdate: false,
                    groupId: this.nodeModel.nodeId
                }
            };
            let thisComponent = this;
            this.bsModalRef = this.modalService.show(UsersFormComponent, initialState);
            this.bsModalRef.content.onSubmitForm
                .subscribe((formData) => {
                    thisComponent.usersService.addData(formData, function (result) {
                        thisComponent.queryParam = {
                            groupId: thisComponent.nodeModel.nodeId,
                            childNodeUser: thisComponent.childNodeUser,
                            queryTime: new Date()
                        };
                    })
                });
        } else if (methodType === 'update') {
            const initialState = {
                initialState: {
                    isUpdate: true,
                    inputUser: event.data,
                    groupId: this.nodeModel.nodeId
                }
            };
            let thisComponent = this;
            this.bsModalRef = this.modalService.show(UsersFormComponent, initialState);
            this.bsModalRef.content.onSubmitForm
                .subscribe((formData) => {
                    thisComponent.usersService.updateData(formData, function (result) {
                        thisComponent.queryParam = {
                            groupId: thisComponent.nodeModel.nodeId,
                            childNodeUser: thisComponent.childNodeUser,
                            queryTime: new Date()
                        };
                    })
                });
        } else if (methodType === 'detail') {
            const initialState = {
                initialState: {
                    nodeModel: this.nodeModel,
                    userInfo: event.data
                }
            };
            this.bsModalRef = this.modalService.show(UsersDetailComponent, initialState);
        }
    }

    uploadUsers() {
        let thisComponent = this;
        this.groupsService.getUnificationByGroupId({groupId: thisComponent.nodeModel.nodeId}, function (unification) {
            const initialState = {
                initialState: {
                    unificationName: unification ? ((unification.parentUnificationName ? (unification.parentUnificationName + ' -> ') : '') + unification.unificationName) : ''
                }
            };
            thisComponent.bsModalRef = thisComponent.modalService.show(UsersUploadComponent, initialState);
            thisComponent.bsModalRef.content.onUploadUsers
                .subscribe((formData) => {
                    thisComponent.spinService.spin(true);
                    formData.set('groupId', thisComponent.nodeModel.nodeId);
                    thisComponent.usersService.uploadFiles(formData, function (result) {
                        thisComponent.spinService.spin(false);
                        if (result) {
                            thisComponent.alertService.showErrorAlert('校验失败', result);
                        } else {
                            thisComponent.nativeToastrService.showSuccess('上传成功');
                        }
                    });
                });
        });
    }


    movewidth() {
        var oBox: any = document.getElementById('parRowWraper');
        var oTop: any = document.getElementById('treewrap');
        var oBottom: any = document.getElementById('tableWraper');
        var oLine: any = document.getElementById('line');
        oLine.onmousedown = function (e) {
            var disX: any = (e || event).clientX;
            oLine.left = oLine.offsetLeft;
            document.onmousemove = function (e: any) {
                var iT = oLine.left + ((e || event).clientX - disX);
                iT < 240 && (iT = 240);
                iT > 450 && (iT = 450);
                oLine.style.left = iT + 13 + 'px';
                oTop.style.width = iT + 20 + 'px';
                let w = oBox.clientWidth - iT - 20;
                oBottom.style.left = iT + 13 + 'px';
                oBottom.style.width = w + 'px';
                return false
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                oLine.releaseCapture && oLine.releaseCapture()
            };
            oLine.setCapture && oLine.setCapture();
            return false
        };
    }
}
