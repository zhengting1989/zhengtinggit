import {Component} from "@angular/core";
import {GroupsService} from "../../personnel/groups/groups.service";
import {UsersService} from "../../personnel/users/users.service";
import {SpinService} from "../../../../common/spin/spin.service";
import {IActionMapping, TREE_ACTIONS, ITreeOptions} from "angular-tree-component";
import {UnificationsService} from "../../personnel/unifications/unifications.service";
import {BsDatepickerConfig, BsLocaleService} from "ngx-bootstrap";
import {ProjectService} from "./project.service";
import {zhCnLocale} from 'ngx-bootstrap/locale';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {PrintData} from '../../../../common/components/excelPrint/excel.print.option';

declare var jQuery: any;
defineLocale('zh-cn', zhCnLocale);

@Component({
    selector: "atnd-equipment-project",
    templateUrl: "project.template.html",
    styleUrls: ["./project.template.scss"]
})
export class ProjectComponent {
    unificationId: any;
    downloadTitle: any;

    public constructor(private groupsService: GroupsService,
                       public usersService: UsersService,
                       private spinService: SpinService,
                       private unificationsService: UnificationsService,
                       private localeService: BsLocaleService,
                       private projectService: ProjectService,) {
    }

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
        this.projectSelect = [];
        this.projectArry = [];
        this.userIdList = [];
        this.treeidlist = [];
        this.filterComment = '';
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
        this.filterComment = '';
        this.AllTable = [];
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
        this.userIdList = [];
        this.treeidlist = [];
        let unificationType: any = {unificationType: "notplatform", userStatus: statu};
        this.usersService.getSelf((userSelf) => {
            this.usertype = userSelf.unificationType;
            if (this.usertype == "platform" || this.usertype == "property") {
                let listType;
                if (this.usertype == "platform") {
                    listType = 'property'
                }
                this.propertyArry = [];
                // this.unificationsService.getDataList({ unificationType: 'notPlatform' }, res => {
                /*res.forEach(data => {
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
                //});
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

    AllTable: any = [];
    exportAllTable: any = [];

    printData: PrintData;
    uA = window.navigator.userAgent;
    isIE = /msie\s|trident\/|edge\//i.test(this.uA) && !!("uniqueID" in document || "documentMode" in document || ("ActiveXObject" in window) || "MSInputMethodContext" in window);
  
    export() {
        let parm = {
            startDate: this.month.length > 0 ? this.formatDate(this.month[0]) : this.formatDate(new Date()),
            endDate: this.month.length > 0 ? this.formatDate(this.month[1]) : this.formatDate(new Date()),
            userIdList: this.userIdList,
            unificationId: this.treeUnificationId 
        };
        let thisComponent = this;
        this.projectService.getAllTable(parm, (res) => {
            this.exportAllTable = res;
            thisComponent.downloadTitle = this.kaoqinname+"_"+this.xiangmuname+'_考勤统计报表_' + parm['startDate'].split('-').join('')+'_'+parm['endDate'].split('-').join('');
            if(this.isIE){
                jQuery("#exportableTableToIE").html(thisComponent.downloadTable(res, parm.startDate, parm.endDate))
                thisComponent.printData = {
                    downloadTitle: thisComponent.downloadTitle,
                    printJson: 'exportableTableToIE',
                    printDate: new Date()
                }
             }else{
                thisComponent.printData = {
                    downloadTitle: thisComponent.downloadTitle,
                    printJson: thisComponent.downloadTable(res, parm.startDate, parm.endDate),
                    printDate: new Date()
                }
            }
        })
    }

    downloadTable(table, startDate, endDate) {
        let thead = document.getElementById('thead').innerHTML;
        let tbody = '';
        for (let i = 0; i < table.length; i++) {
            let num = Number(i + 1)
            tbody += `<tr>
              <th>` + num + `</th>
              <th>` + table[i].userNo + `</th>
              <th>` + table[i].userName + `</th>
              <th>` + table[i].groupNames + `</th>
              <th>` + table[i].standardDay + `</th>
              <th>` + table[i].realDay + `</th>
              <th>` + table[i].standardHour + `</th>
              <th>` + table[i].realHour + `</th>
              <th>` + table[i].missedCount + `</th>
              <th>` + table[i].lateCount + `</th>
              <th>` + table[i].lateHour + `</th>
              <th>` + table[i].earlyCount + `</th>
              <th>` + table[i].earlyHour + `</th>
              <th>` + table[i].absent + `</th>
              <th>` + table[i].absentHour + `</th>
          </tr>`
        }
        return `<table>
                  <thead>
                      <tr>
                          <th colspan="15" >`+this.kaoqinname+`_`+this.xiangmuname+`_考勤统计报表</th>
                      </tr>
                      <tr>
                      <th colspan="15">考勤时间` + startDate + `至` + endDate + `制表时间` + this.searchTime + `</th>
                      </tr>
                      ` + thead + `
                  </thead>
                  <tbody>` + tbody + `
                  </tbody>
                </table>`
    }

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
        this.projectService.getTablePage(parm, (res) => {
            this.total = res ? res.totalNumbers : 0;
            this.AllTable = res.data;
            this.spinService.spin(false);
        })
    }
}
