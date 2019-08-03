import {Component} from "@angular/core";
import {UpgradeService} from "./upgrade.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {UpgradeModalComponent} from "./upgrade.modal.components";
import {SpinService} from "../../../../common/spin/spin.service";
import {AlertService} from "../../../../common/alert.service";
import {NativeToastrService} from "../../../../common/native.toastr.service";
import "rxjs/Rx";

declare var jQuery: any;

@Component({
    selector: "atnd-equipment-upgrade",
    templateUrl: "upgrade.template.html",
    styleUrls: ["upgrade.template.scss"]
})
export class UpgradeComponent {
    public constructor(private upgradeService: UpgradeService,
                       private modalService: BsModalService,
                       private spinService: SpinService,
                       private alertService: AlertService,
                       private nativeToastrService: NativeToastrService) {
    }

    modalRef: BsModalRef;
    upgradeList: any = [];
    keyword: any = "";
    deleteList: any = [];
    updateList: any = [];

    ngOnInit(): void {
        let height = document.body.clientHeight;
        let topnavbarheight = jQuery(".navbar").height();
        jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        window.onresize = () => {
            let height = document.body.clientHeight;
            let topnavbarheight = jQuery(".navbar").height();
            jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        };
        this.getDeviceUpgrade(1, this.perPagNo);
        this.getDeviceSoftwareList();
    }

    getDeviceUpgrade(pageIndex, eventPerPagNo, srarch?) {
        this.spinService.spin(true);
        let parm = {
            pageIndex: pageIndex,
            perPageNo: eventPerPagNo,
            keyword: this.keyword
        };
        if (srarch) {
            this.total = 0;
        }
        this.upgradeService.getDeviceUpgrade(parm, res => {
            this.upgradeList = res.data;
            this.total = res.totalNumbers;
            if (this.perPageChange) {
                this.total = res ? res.totalNumbers : 0;
            }
            this.spinService.spin(false);
            this.checkFlag = false;
        });
    }

    openModal(type) {
        const initialState = {
            initialState: {
                title: type,
                softwareList: this.softwareList,
                updateList: this.updateList
            }
        };
        this.modalRef = this.modalService.show(UpgradeModalComponent, initialState);
        this.modalRef.content.onSubmitForm.subscribe(modalRef => {
            this.getDeviceUpgrade(this.pageIndex, this.perPagNo);
            this.spinService.spin(false);
            this.deleteList = [];
            jQuery("#allcheck").prop("indeterminate", false);
            this.checkFlag = false;
        });
    }

    perPagNo: number = 50;
    pageIndex: number = 1;
    perPageChange: any;
    total: any = 0;

    //分页代码修改
    onPaginationChanged(event) {
        jQuery("#allcheck").prop("indeterminate", false);
        this.deleteList=[];
        this.updateList=[];
        let eventPerPagNo = Number(event.perPageNo);
        let eventPageIndex = Number(event.pageIndex);
        this.pageIndex = eventPageIndex;
        if (eventPerPagNo != this.perPagNo) {
            this.perPagNo = eventPerPagNo;
        }
        this.perPageChange = event.perPageChange;
        if (this.perPageChange) {
            this.total = 0;
        }
        let pageIndex = event.pageIndex;
        this.getDeviceUpgrade(pageIndex, this.perPagNo);
    }

    softwareList: any = [];

    getDeviceSoftwareList() {
        this.upgradeService.getDeviceSoftwareList({}, res => {
            this.softwareList = res;
        });
    }

    search() {
        this.pageIndex = 1;
        this.getDeviceUpgrade(1, this.perPagNo, true);
    }

    enterSearch(e) {
        if (e.keyCode == 13) {
            this.search();
        }
    }

    deleleItem() {
        this.alertService.showCallbackQuestionAlert(
            () => {
                this.upgradeService.deleteDeviceAuth(this.deleteList, res => {
                    this.getDeviceUpgrade(this.pageIndex, this.perPagNo);
                    this.deleteList = [];
                    jQuery("#allcheck").prop("indeterminate", false);
                    this.checkFlag = false;
                });
            },
            () => {
            },
            "提示",
            "确定删除吗？"
        );
    }

    checkFlag: any = false;

    allchecked($event) {
        let checkbox = $event.target;
        this.deleteList = [];
        this.updateList = [];
        if (checkbox.checked) {
            this.upgradeList.forEach(element => {
                this.deleteList.push(element.upgradeId);
                this.updateList.push(element);
            });
        } else {
            this.deleteList = [];
            this.updateList = [];
        }
        this.checkFlag = !this.checkFlag;
    }

    update($event, dx) {
        let checkbox = $event.target;
        let deviceId = this.upgradeList[dx].upgradeId;
        if (checkbox.checked) {
            this.deleteList.push(deviceId);
            this.updateList.push(this.upgradeList[dx]);
        } else {
            let index = this.deleteList.indexOf(deviceId);
            if (index > -1) {
                this.deleteList.splice(index, 1);
                this.updateList.splice(index, 1);
            }
        }
        //判断全选
        let allcheckedFlag = 0;
        for (let index in this.upgradeList) {
            if (jQuery("#allcheck" + index).prop("checked")) {
                allcheckedFlag++;
            }
        }
        if (this.upgradeList.length == allcheckedFlag) {
            jQuery("#allcheck").prop("indeterminate", false);
            this.checkFlag = true;
        }
        if (allcheckedFlag == 0) {
            jQuery("#allcheck").prop("indeterminate", false);
            this.checkFlag = false;
        }
        if (this.upgradeList.length != allcheckedFlag && allcheckedFlag != 0) {
            jQuery("#allcheck").prop("indeterminate", true)
        }
    }

    copy(index) {
        var Url2 = document.getElementById("copy" + index).innerText;
        Url2 = Url2.slice(0, 1) == '/' ? Url2 : '/' + Url2;
        var oInput = document.createElement("input");
        oInput.value =
            window.location.href.split("/#")[0] + "/hilevepsiot/web/v1" + Url2;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = "oInput";
        oInput.style.display = "none";
        this.nativeToastrService.showSuccess("复制成功");
    }

     uA = window.navigator.userAgent;
     isIE = /msie\s|trident\/|edge\//i.test(this.uA) && !!("uniqueID" in document || "documentMode" in document || ("ActiveXObject" in window) || "MSInputMethodContext" in window);
    download(item) {
        let param = {
            param: item.url.toString()
        }
        this.upgradeService.download(param, {}, res => {
            var a = document.createElement("a");
            var blob = new Blob([res], {type: "application/octet-stream"});
            a.href = URL.createObjectURL(blob);
            a.download = item.fileName;
            if (this.isIE) {
              // 兼容IE11无法触发下载的问题
              window.navigator.msSaveBlob(blob, item.fileName);
            } else {
              a.click();
            }
        });
    }
}
