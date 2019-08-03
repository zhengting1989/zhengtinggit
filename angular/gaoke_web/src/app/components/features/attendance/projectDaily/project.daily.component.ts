import {Component} from "@angular/core";
import {GroupsService} from "../../personnel/groups/groups.service";
import {UsersService} from "../../personnel/users/users.service";
import {SpinService} from "../../../../common/spin/spin.service";
import {IActionMapping, TREE_ACTIONS, ITreeOptions} from "angular-tree-component";
import {UnificationsService} from "../../personnel/unifications/unifications.service";
import {BsDatepickerConfig, BsLocaleService, BsModalService, BsModalRef} from "ngx-bootstrap";
import {ProjectService} from "../project/project.service";
import {PropertyDailyModuleComponent} from "../propertyDaily/property.daily.modal.component";
import {defineLocale} from 'ngx-bootstrap/chronos';
import {zhCnLocale} from 'ngx-bootstrap/locale';
import {PrintData} from '../../../../common/components/excelPrint/excel.print.option';

declare var jQuery: any;
defineLocale('zh-cn', zhCnLocale);

@Component({
    selector: "atnd-equipment-project-daily",
    templateUrl: "./project.daily.template.html",
    styleUrls: ["./project.daily.template.scss"]
})
export class ProjectDailyComponent {
    unificationId: any;
    downloadTitle: any;

    public constructor(private groupsService: GroupsService,
                       public usersService: UsersService,
                       private spinService: SpinService,
                       private unificationsService: UnificationsService,
                       private localeService: BsLocaleService,
                       private projectService: ProjectService,
                       private modalService: BsModalService,) {
    }

    modalRef: BsModalRef;
    groupNodes: any = [];
    nodeModel: any;
    pagetitle: any;
    userIdList: any = [];
    treeList: any = [];
    usertype: any = ""; //用户类型
    filterComment: any;
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
        dateInputFormat: 'YYYY-MM-DD'
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

    propertyArry: any = [];//物业下拉
    projectArry: any = [];//项目
    projectSelect: any = [];//项目
    projectSelectId: any;

    onInitialized(tree, statu) {
        this.plam(tree, statu)
    }

    kaoqinname:any=''
    xiangmuname:any=''
    changeproperty(tree) {
        this.propertyArry.forEach(element => {
            if (element['unificationId'] == this.unificationId) {
                this.kaoqinname = element['unificationName'] || '';
            }
        });
        this.total = 0;
        this.AllTable = [];
        this.filterComment = '';
        this.projectSelect = [];
        this.projectArry = [];
        this.treeidlist = [];
        this.userIdList = [];
        this.treeList.forEach(element => {
            if (element['nodeInfo']['unificationId'] == this.unificationId) {
                element.children.forEach(el => {
                    if (el.nodeType == "project") {
                        this.projectArry.push(el);
                        let keyValue = {
                            unificationName: el.name,
                            unificationId: el['nodeInfo']['unificationId']
                        };
                        this.projectSelect.push(keyValue);
                    }
                });
                this.projectSelectId = this.projectArry.length > 0 ? this.projectArry[0]['nodeInfo']['unificationId'] : "";
                this.groupNodes = this.projectArry.length > 0 ? [this.projectArry[0]] : [];
                this.treeUnificationId = this.groupNodes.length>0?this.groupNodes[0]['nodeInfo']['unificationId']:'';
                let arr: any = tree.treeModel.nodes[0] != undefined ? tree.treeModel.nodes[0].children : [];
                for (let i in arr) {
                    tree.treeModel.getNodeById(arr[i].id).setIsSelected(false);
                }
                this.projectSelect.forEach(element => {
                    if (element['unificationId'] == this.projectSelectId) {
                        this.xiangmuname = element['unificationName'] || '';
                    }
                });
            }
        });
        setTimeout(() => {
            tree.treeModel.expandAll();
        });
    }

    changeproject(tree) {
        this.projectSelect.forEach(element => {
            if (element['unificationId'] == this.projectSelectId) {
                this.xiangmuname = element['unificationName'] || '';
            }
        });
        this.total = 0;
        this.AllTable = [];
        this.filterComment = '';
        this.groupNodes = [];
        this.userIdList = [];
        this.treeidlist = [];
        this.projectArry.forEach(element => {
            if (element['nodeInfo']['unificationId'] == this.projectSelectId) {
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

    onEvent(event) {
        this.nodeModel = event.node.data;
        let nodeId = this.nodeModel.nodeId;
    }

    plam(tree, statu) {

        this.spinService.spin(true);
        let thisComponent = this;
        this.AllTable = [];
        this.projectSelect = [];
        this.projectArry = [];
        this.treeidlist = [];
        this.userIdList = [];
        thisComponent.groupNodes = [];
        let unificationType: any = {unificationType: "notplatform", userStatus: statu};
        this.usersService.getSelf((userSelf) => {
            this.usertype = userSelf.unificationType;
            if (this.usertype == "platform" || this.usertype == "property") {
                this.propertyArry = [];
                /*    this.unificationsService.getDataList({ unificationType: 'notPlatform' }, res => {
                      res.forEach(data => {
                        if (data.unificationType == "property") {
                          let keyValue = {
                            unificationName: data.unificationName,
                            unificationId: data.unificationId
                          };
                          this.propertyArry.push(keyValue);
                        }
                      });*/
                unificationType = {
                    showChildUnification: true,
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
                    this.unificationId = this.unificationId == undefined ? (this.propertyArry.length > 0 ? this.propertyArry[0].unificationId : '') : this.unificationId;
                    let cloneRes = [...result];
                    for (let index in cloneRes) {
                        let arr = [];
                        for (
                            let key = 0;
                            key < cloneRes[index]["children"].length;
                            key++
                        ) {
                            if (cloneRes[index]["children"][key]["nodeType"] == "project") {
                                arr.push(cloneRes[index]["children"][key]);
                            }
                        }
                        result[index]["children"] = arr;
                    }
                    this.treeList = result;
                    result.forEach(element => {
                        if (element['nodeInfo']['unificationId'] == this.unificationId) {
                            element.children.forEach(el => {
                                if (el.nodeType == "project") {
                                    this.projectArry.push(el);
                                    let keyValue = {
                                        unificationName: el.name,
                                        unificationId: el['nodeInfo']['unificationId']
                                    };
                                    this.projectSelect.push(keyValue);
                                }
                            });
                            this.projectSelectId = this.projectSelectId == undefined ? (this.projectArry.length > 0 ? this.projectArry[0]['nodeInfo']['unificationId'] : "") : this.projectSelectId;
                            thisComponent.groupNodes = [];
                            this.projectArry.forEach(element => {
                                if (element['nodeInfo']['unificationId'] == this.projectSelectId) {
                                    thisComponent.groupNodes = [element] || [];
                                    thisComponent.treeUnificationId = thisComponent.groupNodes.length>0?thisComponent.groupNodes[0]['nodeInfo']['unificationId']:'';
                                }
                            });
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
                        this.projectSelect.forEach(element => {
                            if (element['unificationId'] == this.projectSelectId) {
                                this.xiangmuname = element['unificationName'] || '';
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
                    this.kaoqinname = userSelf.parentUnificationName;
                    this.xiangmuname = userSelf.unificationName;
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
        this.AllTable = [];
        this.projectService.getAttendee(parm, (res) => {
            this.total = res ? res.totalNumbers : 0;
            this.AllTable = res.data || [];
            this.spinService.spin(false);
        });
        let start = new Date(this.month[0]).getTime();
        let end = new Date(this.month[1]).getTime();
        let month = Number(end) - Number(start);
        if (month > this.datyToHS(90)) {//7776000000  90天的毫秒数
            this.isExport = false
        } else {
            this.isExport = true
        }
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
            thisComponent.exportAllTable = res;
            thisComponent.downloadTitle =  this.kaoqinname+"_"+this.xiangmuname+'_考勤统计日报表_' + param['startDate'].split('-').join('')+'_'+param['endDate'].split('-').join('');
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
                          <th colspan="12" >`+this.kaoqinname+`_`+this.xiangmuname+`_考勤统计日报表</th>
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
