import {Component} from "@angular/core";
import {AttendanceService} from "./attendance.service";
import {IActionMapping, ITreeOptions, TREE_ACTIONS} from "angular-tree-component";
import {DeviceService} from "../../equipment/device/device.service";
import {SpinService} from "../../../../common/spin/spin.service";
import {UsersService} from "../../personnel/users/users.service";
import {Router} from "@angular/router";

declare var jQuery: any;

@Component({
    selector: "atnd-equipment-authorization",
    templateUrl: "attendance.template.html",
    styleUrls: ["./attendance.template.scss"]
})
export class AuthorizationComponent {
    total: any = 0;

    public constructor(private attendanceService: AttendanceService,
                       private deviceService: DeviceService,
                       private spinService: SpinService,
                       public usersService: UsersService,
                       public router: Router,) {
    }

    filterComment: any;
    userIdList: any = [];
    nodeModel: any;
    groupNodes: any;
    userTable: any = [];
    moduleIdList: any = [];
    perPagNo: any = 50;

    fatherFun(msg) {
        this.perPagNo = msg;
    }

    actionMapping: IActionMapping = {
        mouse: {
            /*    click: (tree, node, $event) => {
                 TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
                 this.nodeModel = node.data
                 console.log( $event.path[1].children[0].children[0].checked);
                 console.log(this.moduleIdList);
               }, */
            checkboxClick: (tree, node, $event) => {
                TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
                this.nodeModel = node.data
                this.treeHaschild(node.data, "module", $event.target.checked);
                // console.log( $event.target.checked);
                this.spinService.spin(true);
                this.getdevice()
            }
        }
    };
    options: ITreeOptions = {
        actionMapping: this.actionMapping,
        useCheckbox: true
    };
    routerUrl: any;
    pagetitle: any;

    ngOnInit(): void {
        this.routerUrl = this.router.url.split('/')[2];
        if (this.routerUrl == 'authorization') {
            this.pagetitle = '维护授权'
        } else {
            this.pagetitle = '模块授权'
        }
        this.movewidth();
        let height = document.body.clientHeight;
        let topnavbarheight = jQuery(".navbar").height();
        jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        window.onresize = () => {
            let height = document.body.clientHeight;
            let topnavbarheight = jQuery(".navbar").height();
            jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        };
    }

    ngOnChanges() {
    }

    ngDoCheck() {
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

    //递归查找模块id
    treeHaschild2(tree, data, name) {
        let arr: any = data.children;
        if (data.nodeType == name) {
        } else {
            for (let i in arr) {
                if (arr[i].nodeType == name) {
                    tree.treeModel.getNodeById(arr[i].id).setIsSelected(true)
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
        let index = this.moduleIdList.indexOf(res.nodeId);
        if (index > -1) {
            this.moduleIdList.splice(index, 1);
        } else if (index <= -1 && flag) {
            this.moduleIdList.push(res.nodeId);
        }
    }

    iscollFlag: any = true;
    iscollapse: any = "全部展开";

    isCollapse(tree) {
        this.iscollFlag = !this.iscollFlag;
        if (this.iscollFlag) {
            tree.treeModel.collapseAll();
            this.iscollapse = "全部展开";
        } else {
            tree.treeModel.expandAll();
            this.iscollapse = "全部合并";
        }
    }

    onInitialized(tree) {
        let thisComponent = this;
        this.spinService.spin(true);
        this.attendanceService.getDeviceTree({unificationType: "notPlatform"}, function (result) {
            thisComponent.spinService.spin(false);
            thisComponent.groupNodes = result || [];
            setTimeout(() => {
                tree.treeModel.collapseAll();
                // console.log(tree.treeModel.getNodeById(tree.treeModel.nodes[0].children[0].id));
                //thisComponent.treeHaschild2(tree,tree.treeModel.nodes[3],"module");
            });
        });
    }

    onEvent(event) {
        // this.nodeModel = event.node.data;
    }

    getdevice() {
        let deviceParm = {}
        if (this.routerUrl == 'authorization') {
            deviceParm = {param: 'auth/maintain/page'}
        } else {
            deviceParm = {param: 'auth/usage/page'}
        }
        this.total = 0;
        this.deviceService.getDeviceAuthPage(deviceParm, {
            pageIndex: 1,
            perPageNo: this.perPagNo,
            moduleIdList: this.moduleIdList,
        }, (res: any) => {
            this.total = res.totalNumbers;
            let array = [];
            if (res['data']) {
                res['data'].forEach(element => {
                    array.push(element.userId)
                });
            }
            this.userIdList = array;
            this.usersService.getUsersByIds({userIds: array}, (data) => {
                this.userTable = data
                this.spinService.spin(false);
            })
        })


    }

    showNodeType(): string {
        let nodeTypeTitle = "";
        if (!this.nodeModel) {
            return nodeTypeTitle;
        }
        let nodeType = this.nodeModel.nodeType;
        switch (nodeType) {
            case "group":
                nodeTypeTitle = "部门";
                break;
            case "property":
                nodeTypeTitle = "物业";
                break;
            case "platform":
                nodeTypeTitle = "平台";
                break;
            case "project":
                nodeTypeTitle = "项目";
                break;
            case "device":
                nodeTypeTitle = "设备";
                break;
            case "module":
                nodeTypeTitle = "模块";
                break;
            default:
                nodeTypeTitle = "未知";
                break;
        }
        return nodeTypeTitle;
    }

    movewidth() {
        var oBox: any = document.getElementById("parRowWraper");
        var oTop: any = document.getElementById("treewrap");
        var oBottom: any = document.getElementById("tableWraper");
        var oLine: any = document.getElementById("line");
        oLine.onmousedown = function (e) {
            var disX: any = (e || event).clientX;
            oLine.left = oLine.offsetLeft;
            document.onmousemove = function (e: any) {
                var iT = oLine.left + ((e || event).clientX - disX);
                iT < 240 && (iT = 240);
                iT > 450 && (iT = 450);
                oLine.style.left = iT + 13 + "px";
                oTop.style.width = iT + 20 + "px";
                let w = oBox.clientWidth - iT - 20;
                oBottom.style.left = iT + 13 + "px";
                oBottom.style.width = w + "px";
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
