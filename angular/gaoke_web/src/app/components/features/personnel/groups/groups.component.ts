import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GroupsService} from './groups.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {GroupsDetailComponent} from './groups.detail.component';
import {AlertService} from '../../../../common/alert.service';
import {SpinService} from '../../../../common/spin/spin.service';
import {Constants} from '../../../../common/constants';
import {TabsetComponent} from 'ngx-bootstrap';

declare var jQuery: any;

@Component({
    selector: 'atnd-personnel-groups',
    templateUrl: 'groups.template.html',
    styleUrls: ['./groups.template.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {

    groupNodes: any = [];
    nodeModel: any;
    options: any = {
        allowDrag: true
    };
    groupModalRef: BsModalRef;
    interval;
    filterComment: string;
    checkboxValue: boolean = false;
    unificationInterval;
    unificationType: string;
    treeNodeFromType: string;
    changeCrossDomainDate: any;
    changeGroupUserDate: any;

    @ViewChild('groupTabSets') groupTabSets: TabsetComponent;

    public constructor(private groupsService: GroupsService,
                       private modalService: BsModalService,
                       private alertService: AlertService,
                       private spinService: SpinService) {

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

    ngOnDestroy(): void {
        clearInterval(this.interval);
        clearInterval(this.unificationInterval);
    }

    onChangeAllCheckBox(checked, tree) {
        this.checkboxValue = checked;
        this.nodeModel = undefined;
        this.onInitialized(tree);
    }

    intervalUnificationType() {
        let dyComponent = this;
        let loginUser: any = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';
        this.unificationInterval = setInterval(() => {
            if (loginUser == 'loginUser') {
                loginUser = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';
            } else {
                dyComponent.unificationType = loginUser.unificationType;
                clearInterval(dyComponent.unificationInterval);
            }
        }, 10);
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
            if (thisComponent.groupNodes && thisComponent.groupNodes.length > 0 && !thisComponent.nodeModel) {
                thisComponent.nodeModel = thisComponent.groupNodes[0];
                thisComponent.onEventTreeNodeId = thisComponent.groupNodes[0].id;
            }
            thisComponent.treeNodeFromType = thisComponent.nodeModel.fromType;
            thisComponent.spinService.spin(false);
            setTimeout(() => {
                tree.treeModel.collapseAll();
                tree.treeModel.getNodeById(thisComponent.onEventTreeNodeId)
                    .setActiveAndVisible();
                thisComponent.spinService.spin(false);
                let panelheight = jQuery('#panel-heading').height();
                jQuery('.height-fullbody').css({'height': 'calc(100% - ' + panelheight + 'px - 20px)'});
            });
        })
    }

    onEventTreeNodeId: any = undefined;

    onEvent(event) {
        this.onEventTreeNodeId = event.node.id;
        this.nodeModel = event.node.data;
        this.treeNodeFromType = this.nodeModel.fromType;
        this.gotoTabs();
    }

    gotoTabs() {
        this.groupTabSets.tabs = this.groupTabSets.tabs || [];
        let thisComponent = this;
        this.groupTabSets.tabs.forEach(function (tab) {
            if (tab.active && tab.id === 'user-cross-domain-tab' && !thisComponent.showCrossDomainTab()) {
                tab.active = false;
                thisComponent.groupTabSets.tabs[0].active = true;
            }
        });
    }

    showCrossDomainTab(): boolean {
        return Constants.access && this.unificationType != 'project' && this.treeNodeFromType != 'platform';
    }

    refreshUsers() {

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

    toEdit(tree) {
        const initialState = {
            initialState: {
                groupNode: this.nodeModel,
                readonly: false
            }
        };
        let thisComponent = this;
        this.groupModalRef = this.modalService.show(GroupsDetailComponent, initialState);
        this.groupModalRef.content.onSubmitForm
            .subscribe((formData) => {
                thisComponent.spinService.spin(true);
                if (formData.method === 'PUT') {
                    thisComponent.groupsService.updateGroup([formData.group], function (result) {
                        thisComponent.onInitialized(tree);
                    })
                } else if (formData.method === 'POST') {
                    thisComponent.groupsService.addGroup([formData.group], function (result) {
                        thisComponent.onInitialized(tree);
                    })
                }
            });
    }

    toDelete(tree) {
        let thisComponent = this;
        let title: string = '确认删除[' + this.nodeModel.name + ']?';
        let text: string = '此操作将删除当前部门和其下的所有部门';
        thisComponent.alertService.showCallbackWarningAlert(function (alertResult) {
            thisComponent.spinService.spin(true);
            thisComponent.groupsService.delGroup([thisComponent.nodeModel.nodeId], function (result) {
                thisComponent.nodeModel = undefined;
                thisComponent.alertService.showSuccessAlert();
                thisComponent.onInitialized(tree);
            });
        }, undefined, title, text);
    }

    crossDomainUserChange(event, flag) {
        if (flag) {
            this.changeGroupUserDate = {
                event: event,
                callTime: new Date()
            };
        } else {
            this.changeCrossDomainDate = {
                event: event,
                callTime: new Date()
            };
        }
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
                return false;
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                oLine.releaseCapture && oLine.releaseCapture();
            };
            oLine.setCapture && oLine.setCapture();
            return false;
        };
    }
}
