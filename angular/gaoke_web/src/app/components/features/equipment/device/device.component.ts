import {Component} from "@angular/core";
import {BsModalService} from "ngx-bootstrap/modal";
import {GroupsService} from "../../personnel/groups/groups.service";
import {UsersService} from "../../personnel/users/users.service";
import {DeviceService} from "./device.service";
import {SpinService} from "../../../../common/spin/spin.service";

declare var jQuery: any;

@Component({
    selector: "atnd-equipment-device",
    templateUrl: "device.template.html",
    styleUrls: ["./device.template.scss"]
})
export class DeviceComponent {
    public constructor(private groupsService: GroupsService,
                       public usersService: UsersService,
                       private modalService: BsModalService,
                       private deviceService: DeviceService,
                       private spinService: SpinService) {
    }

    groupNodes: any = [];
    options: any = {
        allowDrag: true
    };
    nodeModel: any;
    queryParam: any = {};
    childNodeUser: boolean = false;
    cumSaveParam: any = {};
    showDeleteAndHq: boolean = true; //是否显示删除按钮 / 是否安装/增加
    deviceType: any;
    unificationId: any;
    deviceTable: any;
    total: any = 0;
    platformSelect: any = [];
    deviceSoftware: any;
    showtree: any;
    perPagNo: any = 50;
    filterComment: any;

    fatherFun(msg) {
        this.perPagNo = msg;
    }

    ngOnChanges(): void {
    }

    ngOnInit(): void {

        this.deviceService.getDeviceType({}, res => {
            this.deviceType = res;
        });
        this.deviceService.getDeviceSoftware({}, res => {
            this.deviceSoftware = res;
        });
        let height = document.body.clientHeight;
        let topnavbarheight = jQuery(".navbar").height();
        jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        jQuery("#parRowWraper2").height(height - topnavbarheight - 160);
        window.onresize = () => {
            let height = document.body.clientHeight;
            let topnavbarheight = jQuery(".navbar").height();
            jQuery("#parRowWraper").height(height - topnavbarheight - 160);
            jQuery("#parRowWraper2").height(height - topnavbarheight - 160);
        };
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
        this.spinService.spin(true);
        let thisComponent = this;
        this.groupsService.getGroupTree({onlyUnification: true}, (result) => {
            this.spinService.spin(false);
            thisComponent.groupNodes = result || [];
            result.forEach(element => {
                if (element.nodeType == "platform") {
                    thisComponent.platformSelect.push(element)
                }
            });
            setTimeout(() => {
                //collapseAll
                //expandAll
                tree.treeModel.collapseAll();
                this.usersService.getSelf((userSelf) => {
                    let showbutton = userSelf;
                    this.showtree = showbutton.unificationType == 'project' || showbutton.unificationType == 'property' ? false : true;
                    this.showDeleteAndHq = showbutton.unificationType == "platform" ? true : false;
                    if (this.showtree) {
                        this.movewidth();
                    }
                    if (!this.showtree) {
                        this.unificationId = result[0].nodeInfo.unificationId;
                        let parm: any = {
                            unificationId: result[0].nodeInfo.unificationId,
                            pageIndex: 1,
                            perPageNo: this.perPagNo,
                        }
                        this.total = 0;
                        this.spinService.spin(true);
                        this.deviceService.getDevice(parm, res => {
                            this.spinService.spin(false);
                            this.deviceTable = res.data;
                            this.total = res.totalNumbers;
                        });
                    }
                })
            });
        });
    }

    onEvent(event) {
        this.nodeModel = event.node.data;
        let nodeId = this.nodeModel.nodeId;
        this.queryParam = {
            groupId: nodeId,
            childNodeUser: this.childNodeUser
        };
        this.cumSaveParam = {
            groupId: nodeId
        };
        this.showDeleteAndHq = this.nodeModel.nodeType == "platform" ? true : false;
        this.unificationId = this.nodeModel.nodeInfo.unificationId;
        let parm: any = {
            unificationId: this.unificationId,
            pageIndex: 1,
            perPageNo: this.perPagNo,
        }
        this.total = 0;
        this.spinService.spin(true);
        this.deviceService.getDevice(parm, res => {
            this.spinService.spin(false);
            this.deviceTable = res.data;
            this.total = res.totalNumbers;
        });
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
