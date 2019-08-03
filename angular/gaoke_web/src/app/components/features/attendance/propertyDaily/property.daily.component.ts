import {Component} from "@angular/core";
import {GroupsService} from "../../personnel/groups/groups.service";
import {UsersService} from "../../personnel/users/users.service";
import {SpinService} from "../../../../common/spin/spin.service";
import {IActionMapping, TREE_ACTIONS, ITreeOptions,} from "angular-tree-component";
import {UnificationsService} from "../../personnel/unifications/unifications.service";
import {BsModalRef, BsModalService, BsDatepickerConfig, BsLocaleService} from "ngx-bootstrap";
import {ProjectService} from "../project/project.service";
import {PropertyDailyModuleComponent} from "./property.daily.modal.component";
import {defineLocale} from 'ngx-bootstrap/chronos';
import {zhCnLocale} from 'ngx-bootstrap/locale';
import {PrintData} from '../../../../common/components/excelPrint/excel.print.option';

declare var jQuery: any;
defineLocale('zh-cn', zhCnLocale);

@Component({
    selector: "atnd-equipment-property-daily",
    templateUrl: "./property.daily.template.html",
    styleUrls: ["./property.daily.template.scss"]
})
export class PropertyDailyComponent {
    unificationId: any;
    downloadTitle: any;

    public constructor(private modalService: BsModalService,
                       private groupsService: GroupsService,
                       public usersService: UsersService,
                       private spinService: SpinService,
                       private unificationsService: UnificationsService,
                       private localeService: BsLocaleService,
                       private projectService: ProjectService,) {
    }

    modalRef: BsModalRef;
    filterComment: any;
    groupNodes: any = [];
    nodeModel: any;
    pagetitle: any;
    userIdList: any = [];
    treeList: any = [];
    usertype: any = ""; //用户类型
    maxDate: any = new Date();
    actionMapping: IActionMapping = {
        mouse: {
            checkboxClick: (tree, node, $event) => {
                TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
                this.nodeModel = node.data;
                this.treeHaschild(node.data, "user", $event.target.checked);
            }
        }
    };
    options: ITreeOptions = {
        actionMapping: this.actionMapping,
        useCheckbox: true
    };
    bsConfig: Partial<BsDatepickerConfig> = {
        showWeekNumbers: false,
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: "theme-dark-blue"
    };
    month: any = [new Date(), new Date()];
    treeUnificationId: any;

    ngOnChanges(): void {
    }

    ngOnInit(): void {
        this.localeService.use("zh-cn")

        //自适应高度以及拖动改变宽度
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

    propertyArry: any = [];

    onInitialized(tree, statu) {
        this.plam(tree, statu)
    }

    onEvent(event) {
        this.nodeModel = event.node.data;
        let nodeId = this.nodeModel.nodeId;
    }

    kaoqinname:any='';
    xiangmuname:any='';
    change(tree) {
        this.propertyArry.forEach(element => {
            if (element['unificationId'] == this.unificationId) {
                this.kaoqinname = element['unificationName'] || '';
            }
        });
        this.total = 0;
        this.AllTable = [];
        this.filterComment = '';
        this.userIdList = [];
        this.treeidlist = [];
        this.treeList.forEach(element => {
            if (element['nodeInfo']['unificationId'] == this.unificationId) {
                this.groupNodes = [element] || [];
                this.treeUnificationId = this.groupNodes.length>0?this.groupNodes[0]['nodeInfo']['unificationId']:'';
                let arr: any = tree.treeModel.nodes[0].children;
                for (let i in arr) {
                    tree.treeModel.getNodeById(arr[i].id).setIsSelected(false);
                }
            }
        });
        setTimeout(() => {
            tree.treeModel.expandAll();
        });
    }

    isFlag: any = false;
    isxianmgu:any=false;
    isStatus(tree) {
        this.total = 0;
        this.userIdList = [];
        this.treeidlist = [];
        this.isFlag = !this.isFlag;
        if (this.isFlag) {
            this.plam(tree, 'all')
        } else {
            this.plam(tree, 'work')
        }
    }

    plam(tree, statu) {
        this.AllTable = [];
        this.userIdList = [];
        this.treeidlist = [];
        this.spinService.spin(true);
        let thisComponent = this;
        let unificationType: any = {unificationType: "notplatform", userStatus: statu};
        this.usersService.getSelf((userSelf) => {
            this.usertype = userSelf.unificationType;
             if (userSelf.unificationType == "project") {
                this.isxianmgu=true;
             }else{
                this.isxianmgu=false;
             }
            if (this.usertype == "platform") {
                this.propertyArry = [];
                /*
                        this.unificationsService.getDataList({ unificationType: 'property' }, res => {
                          res.forEach(data => {
                            if (data.unificationType == "property") {
                              let keyValue = {
                                unificationName: data.unificationName,
                                unificationId: data.unificationId
                              };
                              this.propertyArry.push(keyValue);
                            }
                          });
                          this.unificationId = this.unificationId == undefined ? this.propertyArry[0].unificationId : this.unificationId;
                         */
                unificationType = {
                    unificationType: "notplatform",
                    userStatus: statu
                };
                this.groupsService.getGroupTree(unificationType, (result) => {
                    result.forEach(data => {
                        if (data.nodeType == "property") {
                            let keyValue = {
                                unificationName: data['nodeInfo']['name'],
                                unificationId: data['nodeInfo']['unificationId']
                            };
                            this.propertyArry.push(keyValue);
                        }
                    });
                    this.unificationId = this.unificationId == undefined ? this.propertyArry[0].unificationId : this.unificationId;
                    let cloneRes = [...result];
                    for (let index in cloneRes) {
                        let arr = [];
                        for (
                            let key = 0;
                            key < cloneRes[index]["children"].length;
                            key++
                        ) {
                            if (cloneRes[index]["children"][key]["nodeType"] != "project") {
                                arr.push(cloneRes[index]["children"][key]);
                            }
                        }
                        result[index]["children"] = arr;
                    }
                    this.treeList = result;
                    result.forEach(element => {
                        if (element['nodeInfo']['unificationId'] == this.unificationId) {
                            thisComponent.groupNodes = [element] || [];
                            thisComponent.treeUnificationId = thisComponent.groupNodes.length>0?thisComponent.groupNodes[0]['nodeInfo']['unificationId']:'';
                        }
                    });
                    setTimeout(() => {
                        tree.treeModel.expandAll();
                        let panelheight = jQuery('#panel-heading').height();
                        jQuery('.height-fullbody').css({'height': 'calc(100% - ' + panelheight + 'px - 20px)'});
                        let arr: any = tree.treeModel.nodes[0] != undefined ? tree.treeModel.nodes[0].children : [];
                        for (let i in arr) {
                            tree.treeModel.getNodeById(arr[i].id).setIsSelected(false);
                        }
                        this.propertyArry.forEach(element => {
                            if (element['unificationId'] == this.unificationId) {
                                this.kaoqinname = element['unificationName'] || '';
                            }
                        });
                    });
                    this.spinService.spin(false);
                });
                // });
            } else {
                this.groupsService.getGroupTree(unificationType, (result) => {
                    thisComponent.groupNodes = result || [];
                    thisComponent.treeUnificationId = thisComponent.groupNodes.length>0?thisComponent.groupNodes[0]['nodeInfo']['unificationId']:'';
                    if(this.isxianmgu){
                        this.kaoqinname = userSelf.parentUnificationName;
                        this.xiangmuname = userSelf.unificationName;
                    }else{
                        this.kaoqinname = userSelf.unificationName;
                    }
                    this.spinService.spin(false);
                    setTimeout(() => {
                        tree.treeModel.expandAll();
                        let panelheight = jQuery('#panel-heading').height();
                        jQuery('.height-fullbody').css({'height': 'calc(100% - ' + panelheight + 'px - 20px)'});
                        let arr: any = tree.treeModel.nodes[0] != undefined ? tree.treeModel.nodes[0].children : [];
                        for (let i in arr) {
                            tree.treeModel.getNodeById(arr[i].id).setIsSelected(false);
                        }
                    });
                });
            }
        });
    }

    treeHaschild(data, nodeType, flag) {
        if (data.nodeType == nodeType) {
            this.togglePush(data, flag);
        } else {
            let arr: any = data.children || [];
            for (let i in arr) {
                let arrNodeType = arr[i].nodeType;
                if (arrNodeType == nodeType) {
                    this.togglePush(arr[i], flag);
                } else if (arrNodeType != nodeType && arr != []) {
                    this.treeHaschild(arr[i], nodeType, flag);
                }
            }
        }
    }

    treeidlist: any = [];

    togglePush(node, flag?) {
        this.treeidlist = this.treeidlist || [];
        let toggleId: any = node.id;
        if (flag) {
            let toggleNodeId: any = node.nodeId;
            let haveNode: boolean = false;
            for (var idx = 0, length = this.treeidlist.length; idx < length; idx++) {
                let checkedNode = this.treeidlist[idx];
                if (checkedNode.id === toggleId) {
                    haveNode = true;
                    break;
                }
            }
            if (!haveNode) {
                this.treeidlist.push({'id': toggleId, 'nodeid': toggleNodeId});
            }
        } else {
            let length = this.treeidlist.length;
            if (length > 0) {
                for (var idx = 0; idx < length; idx++) {
                    let checkedNode = this.treeidlist[idx];
                    if (checkedNode.id === toggleId) {
                        this.treeidlist.splice(idx, 1);
                        break;
                    }
                }
            }
        }
        this.userIdList = [];
        this.treeidlist.forEach(element => {
            this.userIdList.push(element.nodeid);
        });
        this.userIdList = Array.from(new Set(this.userIdList));
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

    /*
  @type 时间范围，默认切割到月
      Min：分
  */
    formatDate(date: Date, type?): string {
        if (date) {
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (type) {
                let hour = date.getHours();
                let min = date.getMinutes();
                return date.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + " " + (hour < 10 ? "0" + hour : hour) + ":" + (min < 10 ? "0" + min : min);
            } else {
                return date.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
            }

        }
        return null;
    }

    AllTable: any = []
    keyword: any = '';
    total: any = 0;
    perPagNo: number = 50;
    pageIndex: number = 1;

    //分页代码修改
    onPaginationChanged(event) {
        let eventPerPagNo = Number(event.perPageNo);
        if (eventPerPagNo != this.perPagNo) {
            this.perPagNo = eventPerPagNo;
        }
        let perPageChange = event.perPageChange;
        if (perPageChange) {
            this.total = 0;
        }
        let pageIndex = event.pageIndex;
        if (this.userIdList.length > 0) {
            this.search(pageIndex, true)
        }
        this.pageIndex = pageIndex;
    }

    searchTime: any;

    search(pageIndex?, istrue?) {
        this.pageIndex = 1;
        this.searchTime = this.formatDate(new Date(), true);
        let parm = {
            pageIndex: pageIndex ? pageIndex : 1,
            perPageNo: this.perPagNo,
            startDate: this.month.length > 0 ? this.formatDate(this.month[0]) : this.formatDate(new Date()),
            endDate: this.month.length > 0 ? this.formatDate(this.month[1]) : this.formatDate(new Date()),
            userIdList: this.userIdList,
            unificationId: this.treeUnificationId 
        }
        this.spinService.spin(true);
        if (!istrue) {
            this.total = 0;
        }
        let start = new Date(this.month[0]).getTime();
        let end = new Date(this.month[1]).getTime();
        let month = Number(end) - Number(start);
        if (month > this.datyToHS(90)) {
            this.isExport = false
        } else {
            this.isExport = true
        }
        this.AllTable = [];
        this.projectService.getAttendee(parm, (res) => {
            this.total = res ? res.totalNumbers : 0;
            this.AllTable = res.data || [];
            this.spinService.spin(false);
        })
    }

    openModal(item) {
        const initialState = {
            initialState: {
                timelist: item
            },
            class: "modal-sm"
        };
        this.modalRef = this.modalService.show(PropertyDailyModuleComponent, initialState);
    }

    HSformat(ms) {
        if (ms) {
            return new Date(ms).toLocaleString().slice(9);
        } else {
            return "";
        }
    }

    datyToHS(day) {
        return Number((day - 1) * 24 * 60 * 60 * 1000)
    }

    exportAllTable: any = [];
    printData: PrintData;

    isExport: any = false;
    tabletitle:any;
    uA = window.navigator.userAgent;
    isIE = /msie\s|trident\/|edge\//i.test(this.uA) && !!("uniqueID" in document || "documentMode" in document || ("ActiveXObject" in window) || "MSInputMethodContext" in window);
  
    export() {
        let param = {
            startDate: this.month.length > 0 ? this.formatDate(this.month[0]) : this.formatDate(new Date()),
            endDate: this.month.length > 0 ? this.formatDate(this.month[1]) : this.formatDate(new Date()),
            userIdList: this.userIdList,
            unificationId: this.treeUnificationId 
        };
        let thisComponent = this;
        this.projectService.getAttendeeAll(param, (res) => {
            this.exportAllTable = res;
            if(this.isxianmgu){
                this.tabletitle = this.kaoqinname+'_'+this.xiangmuname;
            }else{
                this.tabletitle = this.kaoqinname;
            }
            thisComponent.downloadTitle =  this.tabletitle+'_考勤统计日报表_' + param['startDate'].split('-').join('')+'_'+param['endDate'].split('-').join('');;
            if(this.isIE){
                jQuery("#exportableTableToIE").html(thisComponent.downloadTable(res, param.startDate, param.endDate))
                thisComponent.printData = {
                    downloadTitle: thisComponent.downloadTitle,
                    printJson: 'exportableTableToIE',
                    printDate: new Date()
                }
             }else{
                thisComponent.printData = {
                    downloadTitle: thisComponent.downloadTitle,
                    printJson: thisComponent.downloadTable(res, param.startDate, param.endDate),
                    printDate: new Date()
                }
            }
        })


    }


    downloadTable(table, startDate, endDate) {
        let thead = document.getElementById('thead').innerHTML;
        let tbody = '';
        for (let i = 0; i < table.length; i++) {
            let count = '';
            for (let j = 0; j < table[i].records.length; j++) {
                if (j < table[i].records.length - 1) {
                    count += this.timeFormat(table[i].records[j].clockInTime) + `,`;
                }
                if (j == table[i].records.length - 1) {
                    count += this.timeFormat(table[i].records[j].clockInTime);
                }
            }
            let num = Number(i + 1)
            let late = table[i].late ? `是` : `否`
            let early = table[i].early ? `是` : `否`
            tbody += `<tr>
              <td>` + num + `</td>
              <td>` + table[i].userNo + `</td>
              <td>` + table[i].userName + `</td>
              <td>` + table[i].groupNames + `</td>
              <td>` + table[i].fullDate + `</td>
              <td>` + this.timeFormat(table[i].firstTime) + `</td>
              <td>` + late + `</td>
              <td>` + table[i].lateHour + `</td>
              <td>` + this.timeFormat(table[i].lastTime) + `</td>
              <td>` + early + `</td>
              <td>` + table[i].earlyHour + `</td>
              <td>` + count + `</td>
          </tr>`
        }
        return `<table>
                  <thead>
                      <tr>
                           <th colspan="12" >`+this.tabletitle+`_考勤统计日报表</th>
                      </tr>
                      <tr>
                      <th colspan="12">考勤时间` + startDate + `至` + endDate + `制表时间` + this.searchTime + `</th>
                      </tr>
                      ` + thead + `
                  </thead>
                  <tbody>` + tbody + `
                  </tbody>
                </table>`
    }

    weeekShow(day) {
        if (day !== undefined) {
            let weekArray = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
            let myDate = new Date(day);
            let week = weekArray[myDate.getDay()];
            return week;
        }
    }
    timeFormat(ms) {
        if (ms) {
            return new Date(ms).toString().slice(16,25);;
        } else {
            return "";
        }
    }
}
