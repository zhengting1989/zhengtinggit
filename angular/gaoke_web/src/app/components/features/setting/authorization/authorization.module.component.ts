import {Component, EventEmitter, Output} from "@angular/core";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {AttendanceService} from "./attendance.service";
import {SpinService} from "../../../../common/spin/spin.service";
import {DeviceService} from "../../equipment/device/device.service";
import {IActionMapping, ITreeOptions, TREE_ACTIONS} from "angular-tree-component";
import {GroupsService} from "../../personnel/groups/groups.service";

declare var jQuery: any;

@Component({
    selector: "atnd-authorization-module",
    templateUrl: "authorization.module.template.html",
    styleUrls: ["./attendance.template.scss"]
})
export class AuthorizationModuleComponent {
    public constructor(private modalService: BsModalService,
                       private attendanceService: AttendanceService,
                       private deviceService: DeviceService,
                       private spinService: SpinService,
                       private groupsService: GroupsService,
                       public bsModalRef: BsModalRef,) {
    }

    filterComment: any;
    @Output() onSubmitForm = new EventEmitter();
    treeidlist: any = []
    moduleIdList: any;
    userIdList: any = [];
    cloneuserIdList: any = [];
    deleteuserIdList: any = [];
    nodeModel: any;
    groupNodes: any;
    routerUrl: any;
    actionMapping: IActionMapping = {
        mouse: {
            checkboxClick: (tree, node, $event) => {
                TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
                this.nodeModel = node.data;
                this.treeHaschild(node.data, "user", $event.target.checked);
                for (let index in tree.nodes) {
                    this.treeHaschild2(tree, tree.nodes[index], "user", true, $event.target.checked, node);
                }
            }
        }
    };
    options: ITreeOptions = {
        actionMapping: this.actionMapping,
        useCheckbox: true
    };

    ngOnInit(): void {
        window.addEventListener("popstate", () => {
            this.bsModalRef.hide();
        });
        this.getdevice();
        let height = document.body.clientHeight;
        let topnavbarheight = jQuery(".navbar").height();
        jQuery("#modal-body").height(height - topnavbarheight - 160);
        jQuery("#parRowWraper").height(height - topnavbarheight - 160);

        window.onresize = () => {
            let height = document.body.clientHeight;
            let topnavbarheight = jQuery(".navbar").height();
            jQuery("#modal-body").height(height - topnavbarheight - 160);
            jQuery("#parRowWraper").height(height - topnavbarheight - 160);

        };
    }

    //递归查找模块id
    treeHaschild(data, name, flag) {
        let arr: any = data.children;
        if (data.nodeType == name) {
            this.togglePush(data, flag);
        } else {
            for (let i in arr) {
                if (arr[i].nodeType == name) {
                    this.togglePush(arr[i], flag);
                } else if (arr[i].nodeType != name && arr != []) {
                    this.treeHaschild(arr[i], name, flag);
                }
                let length: any = arr.length - 1;
                if (arr[i].nodeType == name && i == length) {
                    break;
                }
            }
        }
    }

    treeHaschild2(tree, data, name, click, flag, node) {
        let arr: any = data.children;
        if (data.nodeType == name) {
        } else {
            for (let i in arr) {
                //取消点击时去掉相同nodeid的check
                if (!flag && click && arr[i].nodeId == node.data.nodeId) {
                    tree.getNodeById(arr[i].id).setIsSelected(false);
                }
                if (arr[i].nodeType == name) {
                    for (let index in this.userIdList) {
                        if (arr[i].nodeId == this.userIdList[index]) {
                            if (click) {
                                tree.getNodeById(arr[i].id).setIsSelected(true);
                            } else {
                                tree.treeModel.getNodeById(arr[i].id).setIsSelected(true);
                            }
                        }
                    }
                } else if (arr[i].nodeType != name && arr != []) {
                    if (click) {
                        this.treeHaschild2(tree, arr[i], name, click, flag, node);
                    } else {
                        this.treeHaschild2(tree, arr[i], name, click, flag, node);
                    }
                }
                let length: any = arr.length - 1;
                if (arr[i].nodeType == name && i == length) {
                    break;
                }
            }
        }
    }

    togglePush(res, flag?) {
        let index = this.userIdList.indexOf(res.nodeId);
        let delindex = this.cloneuserIdList.indexOf(res.nodeId);
        if (index > -1 && !flag) {
            this.userIdList.splice(index, 1);
        } else if (index <= -1 && flag) {
            this.userIdList.push(res.nodeId);
        }
        if (delindex > -1 && !flag) {
            this.deleteuserIdList.push(res.nodeId);
        } else if (delindex > -1 && flag) {
            this.deleteuserIdList.splice(index, 1);
        }
        this.userIdList = Array.from(new Set(this.userIdList))
    }

    onInitialized(tree) {
        let thisComponent = this;
        let unificationType;
        if (this.routerUrl == 'authorization') {
            unificationType = {unificationType: 'platform', userStatus: 'work', showChildUnification: true,}
        } else {
            unificationType = {unificationType: 'notPlatform', userStatus: 'work', showChildUnification: true,}
        }
        this.groupsService.getGroupTree(unificationType, function (result) {
            thisComponent.groupNodes = result || [];
            setTimeout(() => {
                tree.treeModel.expandAll();
                for (let index in tree.treeModel.nodes) {
                    thisComponent.treeHaschild2(tree, tree.treeModel.nodes[index], "user", false, false, false);
                }
            });
        });
    }

    subime() {
        let that = this;
        let deviceParm = {}
        if (this.routerUrl == 'authorization') {
            deviceParm = {param: 'auth/maintain'}
        } else {
            deviceParm = {param: 'auth/usage'}
        }
        this.spinService.spin(true);
        this.bsModalRef.hide();
        let addArry = [];
        this.userIdList.forEach(element => {
            let a = 0;
            this.cloneuserIdList.forEach(el => {
                if (element == el) {
                    a++
                }
            });
            if (a == 0) {
                addArry.push(element)
            }
        });
        let del=[];
        this.cloneuserIdList.forEach(element => {
            let a = 0; 
            this.userIdList.forEach(el => {
                if (element == el) {
                    a++
                }
            });
            if (a == 0) {
                del.push(element)
            }
        });
        that.deviceService.deleteDeviceAuth(deviceParm, {
            'moduleIdList': that.moduleIdList,
            'userIdList': del
        }, (res) => {
            that.deviceService.postDeviceAuth(deviceParm, {
                'moduleIdList': that.moduleIdList,
                'userIdList': addArry
            }, (data) => {
                that.onSubmitForm.emit(that.userIdList);
            })
        })
    }

    getdevice() {
        let deviceParm = {}
        if (this.routerUrl == 'authorization') {
            deviceParm = {param: 'auth/maintain'}
        } else {
            deviceParm = {param: 'auth/usage'}
        }
        this.deviceService.getDeviceAuthPage(deviceParm, {moduleIdList: this.moduleIdList}, (res: any) => {
            this.userIdList = res ? res.userIdList : [];
            this.cloneuserIdList = [...this.userIdList];
        })
    }
}
