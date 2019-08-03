import {Component, EventEmitter, Output} from "@angular/core";
import {BsModalRef} from "ngx-bootstrap";
import {SpinService} from "../../../../common/spin/spin.service";
import {DeviceService} from "../device/device.service";
import {IActionMapping, ITreeOptions, TREE_ACTIONS} from "angular-tree-component";
import {AttendanceService} from "../../setting/authorization/attendance.service";

declare var jQuery: any;

@Component({
    selector: "atnd-people-authorization-module",
    templateUrl: "people.authorization.module.template.html",
    styleUrls: ["./people.attendance.template.scss"]
})
export class PeopleAuthorizationModuleComponent {
    public constructor(private attendanceService: AttendanceService,
                       private deviceService: DeviceService,
                       private spinService: SpinService,
                       public bsModalRef: BsModalRef,) {
    }

    @Output() onSubmitForm = new EventEmitter();
    filterComment: any;
    moduleIdList: any;
    userId: any;
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
                this.treeHaschild(node.data, "module", $event.target.checked);
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
        this.getdevice()
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

    treeHaschild2(tree, data, name) {
        let arr: any = data.children;
        if (data.nodeType == name) {
        } else {
            for (let i in arr) {
                if (arr[i].nodeType == name) {
                    for (let index in this.userIdList) {
                        if (arr[i].nodeId == this.userIdList[index]) {
                            tree.treeModel.getNodeById(arr[i].id).setIsSelected(true);
                        }
                    }
                } else if (arr[i].nodeType != name && arr != []) {
                    this.treeHaschild2(tree, arr[i], name);
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
        if (index > -1) {
            this.userIdList.splice(index, 1);
        } else if (index <= -1 && flag) {
            this.userIdList.push(res.nodeId);
        }
        if (delindex > -1 && !flag) {
            this.deleteuserIdList.push(res.nodeId);
        } else if (delindex > -1 && flag) {
            this.deleteuserIdList.splice(index, 1);
        }
    }

    onInitialized(tree) {
        let thisComponent = this;
        this.attendanceService.getDeviceTree({unificationType: "notPlatform"}, function (result) {
            thisComponent.groupNodes = result || [];
            setTimeout(() => {
                tree.treeModel.expandAll();
                for (let index in tree.treeModel.nodes) {
                    thisComponent.treeHaschild2(tree, tree.treeModel.nodes[index], "module");
                }
            });
        });
    }

    subime() {
        let that = this;
        let deviceParm = {param: 'auth/usage'}
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
            'moduleIdList': del,
            'userIdList': [that.userId]
        }, (res) => {
            that.deviceService.postDeviceAuth(deviceParm, {
                'moduleIdList': addArry,
                'userIdList': [that.userId]
            }, (data) => {
                that.onSubmitForm.emit(that.userId);
            })
        })
    }

    getdevice() {
        let deviceParm = {}
        deviceParm = {param: 'auth/user/usage'}
        this.deviceService.getDeviceAuthPage(deviceParm, {userId: this.userId}, (res: any) => {
            this.userIdList = res ? res.moduleIdList : [];
            this.cloneuserIdList = [...this.userIdList];
        })
    }
}
