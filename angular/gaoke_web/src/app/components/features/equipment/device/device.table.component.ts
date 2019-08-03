import {Component, EventEmitter, Input, Output} from "@angular/core";
import {BsModalRef, BsModalService, defineLocale, zhCnLocale} from "ngx-bootstrap";
import {DeviceModalComponent} from "./device.modal.component";
import {AlertService} from "../../../../common/alert.service";
import {DeviceService} from "./device.service";
import {SpinService} from "../../../../common/spin/spin.service";
import {Constants} from '../../../../common/constants';
import {DeviceLogModuleComponent} from "./device.log.modal.component";
import { DeviceInfoModuleComponent } from "./device.info.modal.component";

defineLocale("zh-cn", zhCnLocale);
declare var jQuery: any;

@Component({
    selector: "atnd-device-table",
    templateUrl: "device.table.template.html",
    styleUrls: ["./device.template.scss"]
})
export class DeviceTableComponent {
    constructor(private modalService: BsModalService,
                private alertService: AlertService,
                private deviceService: DeviceService,
                private spinService: SpinService) {
    }

    modalRef: BsModalRef;
    @Output() fromChild = new EventEmitter();
    @Input() showDeleteAndHq: any;
    @Input() deviceType: any;
    @Input() showtree: any;
    @Input() unificationId: any = null;
    @Input() deviceTable: any;
    @Input() total: any;
    @Input() platformSelect: any;
    @Input() nodeModel: any;
    @Input() deviceSoftware: any;
    checkFlag: boolean = false;
    updateArray: any = [];
    keyword: any = '';
    isAdmin: any = "";

    ngOnChanges() {
        this.pageIndex = 1;
        this.updateArray = [];
        this.allUpdateArray = [];
        jQuery("#allcheck").prop("indeterminate", false);
        this.checkFlag = false;
        let showbutton = Constants.loginUser == 'loginUser' ? {} : JSON.parse(Constants.loginUser);
        this.isAdmin = showbutton.admin && showbutton.unificationType == 'platform' ? true : false;
    }

    ngOnInit() {
        this.updateArray = [];
        this.allUpdateArray = [];
    }

    allchecked($event) {
        let checkbox = $event.target;
        this.updateArray = [];
        this.allUpdateArray = [];
        if (checkbox.checked) {
            this.deviceTable.forEach(element => {
                this.updateArray.push(element.deviceId);
                this.allUpdateArray.push(element);
            });
        } else {
            this.updateArray = [];
            this.allUpdateArray = [];
        }
        this.checkFlag = !this.checkFlag;
    }

    enterSearch(e) {
        if (e.keyCode == 13 && this.unificationId != undefined) {
            this.search();
        }
    }

    openModal(type) {
        const initialState = {
            class: "modal-lg",
            initialState: {
                title: type + "设备",
                deviceType: this.deviceType,
                unificationId: this.unificationId,
                deviceTable: this.deviceTable[this.updateclom],
                platformSelect: this.platformSelect,
                nodeModel: this.nodeModel,
                allUpdateArray: this.allUpdateArray,
                deviceSoftware: this.deviceSoftware,
            }
        };
        this.modalRef = this.modalService.show(DeviceModalComponent, initialState);
        this.modalRef.content.onSubmitForm.subscribe(modalRef => {
            this.deviceService.getDevice(
                {
                    unificationId: this.unificationId,
                    keyword: this.keyword,
                    pageIndex: this.pageIndex,
                    perPageNo: this.perPagNo
                },
                res => {
                    this.spinService.spin(false);
                    this.deviceTable = res.data;
                    this.total = res.totalNumbers;
                    this.updateArray = [];
                    jQuery("#allcheck").prop("indeterminate", false);
                    this.checkFlag = false;
                    this.allUpdateArray = [];

                }
            );
        });
    }

    toDeletes() {
        this.alertService.showCallbackQuestionAlert(
            () => {
                this.spinService.spin(true);
                this.deviceService.deleteDevice(this.updateArray, () => {
                    this.updateArray = [];
                    //this.total = 0;
                    this.deviceService.getDevice(
                        {
                            unificationId: this.unificationId,
                            keyword: this.keyword,
                            pageIndex: this.pageIndex,
                            perPageNo: this.perPagNo
                        },
                        res => {
                            this.spinService.spin(false);
                            this.deviceTable = res.data;
                            this.total = res.totalNumbers;
                            this.updateArray = [];
                            jQuery("#allcheck").prop("indeterminate", false);
                            this.checkFlag = false;
                        }
                    );
                });
            },
            () => {
            },
            "提示",
            "确定删除吗？"
        );
    }

    updateclom: any = -1;
    allUpdateArray: any = []

    update($event, dx) {
        let checkbox = $event.target;
        let deviceId = this.deviceTable[dx].deviceId;
        if (checkbox.checked) {
            this.updateclom = dx;
            this.updateArray.push(deviceId);
            this.allUpdateArray.push(this.deviceTable[dx]);
        } else {
            let index = this.updateArray.indexOf(deviceId);
            if (index > -1) {
                this.updateArray.splice(index, 1);
                this.allUpdateArray.splice(index, 1);
            }
        }
        //判断全选
        let allcheckedFlag = 0;
        for (let index in this.deviceTable) {
            if (jQuery("#allcheck" + index).prop("checked")) {
                allcheckedFlag++;
            }
        }
        if (this.deviceTable.length == allcheckedFlag) {
            jQuery("#allcheck").prop("indeterminate", false);
            this.checkFlag = true;
        }
        if (allcheckedFlag == 0) {
            jQuery("#allcheck").prop("indeterminate", false);
            this.checkFlag = false;
        }
        if (this.deviceTable.length != allcheckedFlag && allcheckedFlag != 0) {
            jQuery("#allcheck").prop("indeterminate", true)
        }
    }

    keyWords: string = "";
    perPagNo: number = 50;
    pageIndex: number = 1;

    //分页代码修改
    onPaginationChanged(event) {
        jQuery("#allcheck").prop("indeterminate", false);
        this.updateArray=[];
        this.allUpdateArray=[];
        let eventPerPagNo = Number(event.perPageNo);
        let eventPageIndex = Number(event.pageIndex);
        this.pageIndex = eventPageIndex;
        if (eventPerPagNo != this.perPagNo) {
            this.perPagNo = eventPerPagNo;
            this.fromChild.emit(this.perPagNo);
        }
        let perPageChange = event.perPageChange;
        if (perPageChange) {
            this.total = 0;
        }
        let pageIndex = event.pageIndex;
        let parm: any = {
            unificationId: this.unificationId,
            pageIndex: pageIndex,
            perPageNo: eventPerPagNo,
            keyword: this.keyword
        }
        if (this.unificationId != null) {
            this.spinService.spin(true);
            this.deviceService.getDevice(
                parm,
                res => {
                    this.spinService.spin(false);
                    this.deviceTable = res.data;
                    this.total = res.totalNumbers
                    if (perPageChange) {
                        this.total = res ? res.totalNumbers : 0;
                    }
                    jQuery("#allcheck").prop("indeterminate", false);
                    this.checkFlag = false;
                }
            );
        }

    }

    isSearch: any = false;

    search() {
        this.pageIndex = 1;
        this.spinService.spin(true);
        this.isSearch = true;
        this.total = 0;
        this.deviceService.getDevice(
            {
                unificationId: this.unificationId,
                keyword: this.keyword,
                pageIndex: 1,
                perPageNo: this.perPagNo
            },
            res => {
                this.spinService.spin(false);
                this.deviceTable = res.data;
                this.total = res.totalNumbers;
                this.updateArray = [];
                jQuery("#allcheck").prop("indeterminate", false);
                this.checkFlag = false;
            }
        );
    }

    openLogModal(item) {
        const initialState = {
            class: "modal-lg",
            initialState: {
                device: item
            }
        };
        this.modalRef = this.modalService.show(DeviceLogModuleComponent, initialState);
    }
    openDeviceInfo(){

        const initialState = {
            class: "modal-lg",
            initialState: {
            }
        };
        this.modalRef = this.modalService.show(DeviceInfoModuleComponent, initialState);
    }
    formatter(value) {
        if (value) {
            return '<span class="label label-primary">激活</span>';
        }
        if (!value) {
            return '<span class="label label-danger">未激活</span>';
        }
       
    }
}
