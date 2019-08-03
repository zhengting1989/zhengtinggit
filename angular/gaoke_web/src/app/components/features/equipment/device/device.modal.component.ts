import {Component, EventEmitter, Output} from "@angular/core";
import {BsModalRef} from "ngx-bootstrap";
import {DeviceService} from "./device.service";
import {SpinService} from "../../../../common/spin/spin.service";
import {SearchOption} from "../../../../common/components/searchSelect/search.select.componet";

declare var jQuery: any;

@Component({
    selector: "atnd-device-modal",
    templateUrl: "device.modal.template.html",
    styleUrls: ["./device.template.scss"]
})
export class DeviceModalComponent {
    constructor(private deviceService: DeviceService,
                public bsModalRef: BsModalRef,
                private spinService: SpinService) {
    }

    title: any = "";
    deviceSoftware: any;
    selected: "";
    deviceType: any;
    unificationId: any;
    deviceTable: any;
    modulePage: any = [];
    moduleArray: any = [];
    deviceArray: any = [];
    platformSelect: any = [];
    nodeModel: any;
    allUpdateArray: any;
    addFlag: any = false;//添加设备校验
    installFlag: any = false;//安装设备校验

    @Output() onSubmitForm = new EventEmitter();

    ngOnInit() {
        this.oldSN = this.deviceTable?this.deviceTable.sn:'';
        this.deModules = this.deviceTable?this.deviceTable.deviceModules:[];
        window.addEventListener("popstate", () => {
            this.bsModalRef.hide();
        });
        this.installlist[0].value = this.editColumns ? this.editColumns[0].value = this.nodeModel["name"] : '';
        this.plformList[0].value = this.platformSelect.length > 0 ? this.platformSelect[0]['nodeInfo']['unificationId'] : '';
        this.asyncLoadFunction();
        if (this.title == "批量修改设备") {
            this.addmodul();
            let nolable = {sold: "", activated: "", status: ""};
            for (let key in nolable) {
                for (let index in this.pzColumns) {
                    if (this.pzColumns[index]["lable"] == key) {
                        this.pzColumns[index]["value"] = nolable[key];
                    }
                }
            }
        }
        if (this.title == "修改设备") {
            for (let key in this.deviceTable) {
                for (let index in this.pzColumns) {
                    //if (this.pzColumns[index]["lable"] == key && key != 'deviceSoftwares') {
                    if (this.pzColumns[index]["lable"] == key) {
                        this.pzColumns[index]["value"] = this.deviceTable[key];
                    }
                    /*if (this.pzColumns[index]["lable"] == 'deviceSoftwares') {
                      for(let vinx in this.deviceSoftware){
                        if(this.deviceSoftware[vinx]['name']==this.deviceTable['deviceSoftwares'][0]['name']){
                          this.pzColumns[index]["value"] = vinx;
                        }
                      }
                    }*/
                }
                for (let index in this.wlColumns) {
                    if (this.wlColumns[index]["lable"] == key) {
                        this.wlColumns[index]["value"] = this.deviceTable[key];
                    }
                }
            }
            let deviceModulesNum = this.deviceTable["deviceModules"].length;
            let deviceModules = this.deviceTable["deviceModules"];
            for (let i = 0; i < deviceModulesNum; i++) {
                this.addmodul();
            }
            for (let key in deviceModules) {
                for (let dikey in deviceModules[key]) {
                    for (let index in this.modulePage) {
                        for (let i in this.modulePage[index]) {
                            if (this.modulePage[index][i]["lable"] == dikey && index == key) {
                                this.modulePage[index][i]["value"] = deviceModules[key][dikey];
                            }
                        }
                    }
                }
            }
            this.installlist[1].value = this.deviceTable["location"];
        }
    }

    ngOnChanges() {
    }

    updateFlag: any = false;

    ngDoCheck() {
        if (this.title == '新增设备') {
            if (!this.isOneDeviceSn && this.pzColumns[0]['value'] && this.pzColumns[1]['value']) {
                this.addFlag = true;
            } else {
                this.addFlag = false;
            }
            this.modulePage.forEach((element, index) => {
                if (!this.isOneDeviceSn && !this.isOneModuleSnList[index] && element[0].value && element[1].value && this.pzColumns[0]['value'] && this.pzColumns[1]['value']) {
                    this.addFlag = true;
                } else {
                    this.addFlag = false;
                }
            });
            this.modulePage.forEach((element, index) => {
                if (element[0].value == "" || element[1].value == "" || this.isOneModuleSnList[index]) {
                    this.addFlag = false;
                }
            });
        }
        if (this.title == '修改设备') {
            if (!this.isOneDeviceSn && this.pzColumns[0]['value'] && this.pzColumns[1]['value']) {
                this.updateFlag = true;
            } else {
                this.updateFlag = false;
            }
            this.modulePage.forEach((element, index) => {
                if (!this.isOneDeviceSn && !this.isOneModuleSnList[index] && element[0].value && element[1].value && this.pzColumns[0]['value'] && this.pzColumns[1]['value']) {
                    this.updateFlag = true;
                } else {
                    this.updateFlag = false;
                }
            });
            this.modulePage.forEach((element, index) => {
                if (element[0].value == "" || element[1].value == "" || this.isOneModuleSnList[index]) {
                    this.updateFlag = false;
                }
            });
            /*
                  this.isOneModuleSnList.forEach((element) => {
                    if (!element&&!this.isOneDeviceSn&&this.pzColumns[0]['value'] && this.pzColumns[1]['value']){
                      this.updateFlag = true;
                    }
                  });
                  this.isOneModuleSnList.forEach((element) => {
                    if(element){
                      this.updateFlag = false;
                    }
                  });*/
        }
        if (this.title == '安装设备') {
            if (this.installArray.join("")) {
                this.installFlag = true
            } else {
                this.installFlag = false
            }
        }
    }

    editColumns: any = [
        {
            type: "text",
            name: "所属公司",
            value: "",
            readonly: true
        }
    ];
    installlist: any = [
        {
            type: "text",
            name: "所属公司",
            value: "",
            hide: true
        },
        {
            type: "text",
            name: "安装地址",
            value: ""
        }
    ];
    deviceList: any = [
        {
            type: "searchselect",
            name: "选择设备",
            value: "",
            list: []
        }
    ];
    plformList: any = [
        {
            type: "select",
            name: "选择平台",
            value: "",
            list: this.platformSelect
        }
    ];
    pzColumns: any = [
        {
            type: "text",
            name: "设备串码",
            value: "",
            lable: "sn",
            hide: true,
            required: true
        },
        {
            type: "selecttype",
            name: "设备类型",
            list: this.deviceType,
            value: "",
            lable: "typeId",
            required: true
        },
        {
            type: "text",
            name: "设备型号",
            value: "",
            lable: "model",
            hide: true
        },
        {
            type: "text",
            name: "CPU信息",
            value: "",
            lable: "cpu"
        },
        {
            type: "text",
            name: "内存信息",
            value: "",
            lable: "memory"
        },
        {
            type: "text",
            name: "硬盘信息",
            value: "",
            lable: "disk"
        },
        {
            type: "text",
            name: "其他硬件参数",
            value: "",
            lable: "other"
        },
        {
            type: "select",
            name: "是否激活",
            list: [{name: "是", lable: true}, {name: "否", lable: false}],
            value: true,
            lable: "activated"
        },
        {
            type: "text",
            name: "备注",
            value: "",
            lable: "remark"
        },
        {
            type: "select",
            name: "状态",
            list: [
                {name: "正常", lable: 1},
                {name: "停用", lable: 3}
            ],
            value: 1,
            lable: "status"
        }
    ];
    wlColumns: any = [
        {
            type: "text",
            name: "IP地址",
            value: "",
            lable: "ip",
            hide: true
        },
        {
            type: "text",
            name: "子网掩码",
            value: "",
            lable: "subnet"
        },
        {
            type: "text",
            name: "默认网关",
            value: "",
            lable: "gateway"
        },
        {
            type: "text",
            name: "DNS服务器",
            value: "",
            lable: "dns"
        }
    ];

    addmodul(t?) {
        let mkColumns: any = [
            {
                type: "text",
                name: "模块串码",
                value: "",
                lable: "sn",
                hide: false,
                required: true
            },
            {
                type: "text",
                name: "模块型号",
                value: "",
                lable: "model",
                hide: false,
                required: true
            },
            {
                type: "text",
                name: "模块描述",
                value: "",
                lable: "description",
            },
            {
                type: "text",
                name: "厂商",
                value: "",
                lable: "manufacturer"
            },
            {
                type: "text",
                name: "其他硬件参数",
                value: "",
                lable: "other"
            },
            {
                type: "text",
                name: "备注",
                value: "",
                lable: "remark"
            },
            {
                value: "",
                lable: "moduleId",
                hide: true
            }
        ];
        this.modulePage.push(mkColumns);
        this.isOneModuleSnList.push(false);
    }

    deleteModule(index) {
        this.modulePage.splice(index, 1);
        this.isOneModuleSnList.splice(index, 1);
    }

    onSubmit(type) {
        this.bsModalRef.hide();
        if (type != "install") {
            //modal
            this.moduleArray = [];
            this.modulePage.forEach(element => {
                let obj = {};
                element.forEach(arr => {
                    obj[arr.lable] = arr.value;
                });
                obj["valid"] = true;
                this.moduleArray.push(obj);
            });
            //device
            let deviceobj: any = {};
            this.pzColumns.forEach(element => {
                /*if(element.lable=='deviceSoftwares' && element.value){
                  deviceobj[element.lable] = [
                    {
                      name:this.deviceSoftware[element.value].name,
                      softwareId:this.deviceSoftware[element.value].softwareId,
                    }
                  ]
                }else{*/
                deviceobj[element.lable] = element.value;
                //}
            });
            this.deviceArray.push(deviceobj);
            this.deviceArray[0].deviceModules = this.moduleArray;
            this.deviceArray[0].unificationId = this.unificationId;
            this.deviceArray[0].valid = true;
            this.spinService.spin(true);

            if (type == "update") {
                //deviceId
                if (this.nodeModel.nodeType == "platform") {
                    this.deviceArray[0].deviceId = this.deviceTable["deviceId"];
                    this.deviceService.updateDevice(this.deviceArray, () => {
                        this.onSubmitForm.emit();
                    });
                } else {
                    this.deviceArray[0].deviceId = this.deviceTable["deviceId"];
                    this.wlColumns.forEach(element => {
                        this.deviceArray[0][element.lable] = element.value;
                    });
                    this.deviceArray[0]["location"] = this.installlist[1].value;
                    this.deviceArray[0].unificationId = this.unificationId;
                    // 如果设备不属于平台，那么这个时候肯定是已经售出的状态。
                    // 如果不传递这个参数的话，后台会把状态修改为false。
                    this.deviceArray[0].sold = true;
                    // this.deviceTable.activated = this.deviceArray[0].activated;
                    // this.deviceService.updateDevice([this.deviceTable], () => {
                    this.deviceService.updateDevice(this.deviceArray, () => {
                        this.onSubmitForm.emit();
                    });
                }
            }
            if (type == "add") {
                this.deviceService.addDevice(this.deviceArray, () => {
                    this.onSubmitForm.emit();
                });
            }
            if (type == "allUpdate") {
                deviceobj.deviceModules = "";
                for (let key in deviceobj) {
                    this.allUpdateArray.forEach(element => {
                        if (deviceobj[key] != "") {
                            element[key] = deviceobj[key];
                        }
                    });
                }
                for (let index in this.moduleArray[0]) {
                    this.allUpdateArray.forEach(element => {
                        element.unificationId = this.unificationId;
                        element["deviceModules"].forEach(el => {
                            if (this.moduleArray[0][index] != "") {
                                el[index] = this.moduleArray[0][index];
                            }
                        });
                    });
                }
                if (this.nodeModel.nodeType != "platform") {
                    this.wlColumns.forEach(element => {
                        this.allUpdateArray.forEach(el => {
                            if (element.value != "") {
                                el[element.lable] = element.value;
                            }
                        });
                    });
                }
                this.deviceService.updateDevice(this.allUpdateArray, () => {
                    this.onSubmitForm.emit();
                });
            }
        }
        if (type == "install") {
            this.installArray[0].unificationId = this.unificationId;
            this.installArray[0].location = this.installlist[1].value;
            this.wlColumns.forEach(element => {
                this.installArray[0][element.lable] = element.value;
            });
            this.installArray.forEach(element => {
                delete element['optionField']
            });
            // fix #147
            this.installArray[0].sold = true;
            this.deviceService.updateDevice(this.installArray, () => {
                this.onSubmitForm.emit();
            });
        }
    }

    installArray: any = [];
    searchNum: any = 0;
    deviceListArray: any = [];
    asyncSearchOption: SearchOption = {
        placeholder: "请选择设备...",
        searchId: "device",
        optionId: "feeSearchId",
        optionField: "optionField",
        asyncLoading: false
    };
    showItems: any[] = [];
    deModules: any = [];

    asyncLoadFunction() {
        let thisComponent = this;
        this.deviceService.getDevice(
            {
                unificationId: this.plformList[0].value
            },
            res => {
                res['data'].forEach(element => {
                    element['optionField'] = element['typeName'] + "-" + element['sn']
                });
                thisComponent.showItems = res.data;
            }
        );
    }

    onSearchOnSelect($event) {
        this.installArray = [$event.selected.item];
    }

    keyupOnSelect(event) {
        const thisComponent = this;
        this.searchNum++;
        setTimeout(() => {
            thisComponent.searchNum--;
            if (thisComponent.searchNum == 0 && event) {
                this.deviceService.getDevice(
                    {
                        unificationId: this.plformList[0].value,
                        keyword: event.key
                    },
                    res => {
                        jQuery("search-select input").click();
                        res['data'].forEach(element => {
                            element['optionField'] = element['typeName'] + "-" + element['sn']
                        });
                        thisComponent.showItems = res.data;
                    }
                );
            }
        }, 500);
    }

    isOneDeviceSn: any = false;
    isOneModuleSnList: any = [];

    checkSN(type, item, index?) {
        if (this.oldSN != item.value) {
            if (item['value'] && type == 'device') {
                this.deviceService.checkSn({param: 'sn/check'}, {deviceSN: item['value']}, (res) => {
                    this.isOneDeviceSn = res;
                })
            }
        }
        if (this.oldSN == item.value) {
            this.isOneDeviceSn = false;
        }
        if ((index <= this.deModules.length - 1 && this.deModules[index]['sn'] != item.value) || index > this.deModules.length - 1) {
            if (item['value'] && type == 'module') {
                this.deviceService.checkSn({param: 'module/sn/check'}, {moduleSN: item['value']}, (res) => {
                    this.isOneModuleSnList[index] = res;
                    let num = 0;
                    this.modulePage.forEach(element => {
                        element.forEach(arr => {
                            if (arr['value'] == item.value && arr['lable'] == 'sn') {
                                num++;
                            }
                        });
                    });
                    if (num > 1) {
                        this.isOneModuleSnList[index] = true;
                    }
                })
            }
        }
        if (index <= this.deModules.length - 1 && this.deModules[index]['sn'] == item.value){
            this.isOneModuleSnList[index] = false;
        }
        this.keyup(item, index);
    }

    oldSN = '';

    focusSN(type, item) {
        //this.oldSN=item.value
    }

    trim(type, dx, index?) {
        if (type == "device") {
            let deviceSN = this.pzColumns[dx]['value'].replace(/\s+/g, "");
            this.pzColumns[dx]['value'] = deviceSN;
        } else {
            let modelSn = this.modulePage[dx][index]['value'].replace(/\s+/g, "");
            this.modulePage[dx][index]['value'] = modelSn;
        }
    }
    keyup(item, index?) {
        if (item['value'] == '') {
            this.isOneDeviceSn = false;
            this.isOneModuleSnList[index] = false;
        }
    }
}
