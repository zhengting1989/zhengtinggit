import {Component} from "@angular/core";
import {DeviceService} from "../device/device.service";
import {SpinService} from "../../../../common/spin/spin.service";
import {UsersService} from "../../personnel/users/users.service";
import {Router} from "@angular/router";
import {GroupsService} from "../../personnel/groups/groups.service";
import {Constants} from '../../../../common/constants';

declare var jQuery: any;

@Component({
    selector: "atnd-equipment-people-authorization",
    templateUrl: "people.attendance.template.html",
    styleUrls: ["./people.attendance.template.scss"]
})
export class PeopleAuthorizationComponent {
    total: any = 0;

    public constructor(private deviceService: DeviceService,
                       private spinService: SpinService,
                       public usersService: UsersService,
                       public router: Router,
                       private groupsService: GroupsService,) {
    }

    filterComment: any;
    userIdList: any = [];
    nodeModel: any = {name: ''};
    groupNodes: any;
    userTable: any = [];
    moduleIdList: any = [];
    perPagNo: any = 50;

    fatherFun(msg) {
        this.perPagNo = msg;
    }

    options: any = {
        allowDrag: true
    };
    routerUrl: any;
    pagetitle: any;

    ngOnInit(): void {
        this.routerUrl = this.router.url.split('/')[2];
        this.pagetitle = '人员授权'
        this.movewidth();
        let height = document.body.clientHeight;
        let topnavbarheight = jQuery(".navbar").height();
        jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        window.onresize = () => {
            let height = document.body.clientHeight;
            let topnavbarheight = jQuery(".navbar").height();
            jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        };
        this.intervalUnificationType()
    }

    ngOnChanges() {
    }

    ngDoCheck() {
    }

    isshowChildren: any;

    showChildren(tree) {
        let thisComponent = this;
        let unificationType;
        this.isshowChildren = !this.isshowChildren;
        if (this.isshowChildren) {
            unificationType = {unificationType: 'notPlatform', userStatus: 'work', showChildUnification: true}
        } else {
            unificationType = {unificationType: 'notPlatform', userStatus: 'work', showChildUnification: false}
        }
        this.groupsService.getGroupTree(unificationType, function (result) {
            thisComponent.groupNodes = result || [];
            setTimeout(() => {
                tree.treeModel.expandAll();
            });
        });
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
        let unificationType;
        this.spinService.spin(true);
        unificationType = {unificationType: 'notPlatform', userStatus: 'work', showChildUnification: false}
        this.groupsService.getGroupTree(unificationType, function (result) {
            thisComponent.spinService.spin(false);
            thisComponent.groupNodes = result || [];
            setTimeout(() => {
                tree.treeModel.collapseAll();
                let panelheight = jQuery('#panel-heading').height();
                jQuery('.height-fullbody').css({'height': 'calc(100% - ' + panelheight + 'px - 20px)'});
            });
        });
    }

    userId: any;

    onEvent(event) {
        this.nodeModel = event.node.data;
        if (this.nodeModel.nodeType == 'user') {
            this.userId = this.nodeModel.nodeId;
            this.getdevice()
        } else {
            this.userId = '';
            this.userIdList = [];
            this.userTable = []
            this.total = 0;
        }
    }

    getdevice() {
        this.spinService.spin(true);
        this.total = 0;
        this.deviceService.getPeopleAuthPage({
            pageIndex: 1,
            perPageNo: this.perPagNo,
            userId: this.userId
        }, (res: any) => {
            this.total = res.totalNumbers;
            let array = [];
            if (res['data']) {
                res['data'].forEach(element => {
                    array.push(element.deviceModule.moduleId)
                });
            }
            this.userIdList = array;
            this.userTable = res.data;
            this.spinService.spin(false);
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
            case "user":
                nodeTypeTitle = "人员";
                break;
            default:
                nodeTypeTitle = "";
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


    unificationInterval;
    unificationType: string;

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
}
