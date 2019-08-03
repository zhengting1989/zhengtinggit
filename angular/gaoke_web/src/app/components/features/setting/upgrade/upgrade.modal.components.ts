import {Component, EventEmitter, Output} from "@angular/core";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {SpinService} from "../../../../common/spin/spin.service";
import {DeviceService} from "../../equipment/device/device.service";
import {UpgradeService} from "./upgrade.service";

declare var jQuery: any;

@Component({
    selector: "atnd-upgrade-modal",
    templateUrl: "upgrade.modal.template.html",
    styleUrls: ["./upgrade.template.scss"]
})
export class UpgradeModalComponent {
    public constructor(private modalService: BsModalService,
                       private deviceService: DeviceService,
                       private spinService: SpinService,
                       public bsModalRef: BsModalRef,
                       public upgradeService: UpgradeService) {
    }

    @Output() onSubmitForm = new EventEmitter();
    softwareList: any = [];
    updateList: any = [];
    title: any;

    ngOnInit() {
        window.addEventListener("popstate", () => {
            this.bsModalRef.hide();
        });
        this.plformList[0].list = this.softwareList
        if (this.title == '修改') {
            for (let index in this.updateList) {
                for (let key in this.updateList[index]) {
                    this.plformList.forEach((el) => {
                        if (el.lable == key) {
                            el.value = this.updateList[index][key]
                        }
                        if (key == 'deviceSoftware') {
                            el.value = this.updateList[index][key]['softwareId'];
                        }
                    })
                }
            }
        }
    }

    plformList: any = [
        {
            type: "select",
            name: "软件名称",
            value: "",
            lable: "deviceSoftware",
            list: this.softwareList,
            required: true
        },
        {
            type: "number",
            name: "软件版本",
            value: "",
            lable: "version",
            required: true
        },
        {
            type: "number",
            name: "build版本",
            value: "",
            lable: "build",
            required: true
        },
        {
            type: "select",
            name: "是否强制更新",
            list: [{name: "是", softwareId: true}, {name: "否", softwareId: false}],
            value: true,
            lable: "force"
        },
        {
            type: "file",
            name: "上传文件",
            value: "",
            lable: "fileName",
            required: true
        },
        {
            type: "text",
            name: "更新说明",
            value: "",
            lable: "remark"
        }
    ]
    addFlag: any = false;
    ediltFlag: any = false;

    ngDoCheck() {
        if (this.plformList[0]['value'] && this.plformList[1]['value'] && this.plformList[2]['value'] && this.fileName != "") {
            this.addFlag = true;
        } else {
            this.addFlag = false;
        }
        if (this.plformList[2]['value'] && this.plformList[1]['value']) {
            this.ediltFlag = true;
        } else {
            this.ediltFlag = false;
        }
    }

    file: any;
    fileName: any = '';
    inputName = "请选择文件";
    inputFlag = '';
    feehisflag: any;

    fileChange(event) {
        let fileList = event.target.files;
        if (fileList.length > 0) {
            let file = fileList[0];
            this.inputName = file.name
            let formData = new FormData();
            formData.append('uploadFile', file);
            this.file = file;
            this.inputFlag = '正在上传...';
            this.spinService.spin(true);
            this.feehisflag = false;
            this.upgradeService.postDeviceFile(formData, (res) => {
                this.fileName = this.plformList[4]['value'] = res;
                this.inputFlag = '上传成功'
                this.spinService.spin(false);
                this.feehisflag = true;
            })

        }
    }

    upgradeAray: any = [];

    subime() {
        this.upgradeAray = [];
        let obj = {};
        this.plformList.forEach((el) => {
            if (el.lable == 'deviceSoftware') {
                this.softwareList.forEach((res) => {
                    if (res.softwareId == el.value) {
                        obj[el.lable] = {
                            "name": res.name,
                            "softwareId": res.softwareId,
                            "valid": true
                        }
                    }
                })
            } else if (el.lable == 'fileName') {
                obj[el.lable] = this.fileName;
            } else {
                obj[el.lable] = el.value;
            }
        })
        obj['valid'] = true;
        this.upgradeAray.push(obj)
        this.bsModalRef.hide()
        if (this.title == '新增') {
            this.upgradeService.postDeviceAuth(this.upgradeAray, (data) => {
                this.onSubmitForm.emit();
            })
        }
        if (this.title == '修改') {
            this.updateList.forEach((res) => {
                this.upgradeAray.forEach((ele) => {
                    ele['upgradeId'] = res['upgradeId'];
                })
            })
            if (this.upgradeAray[0]['fileName'] == '') {
                this.plformList.forEach((el) => {
                    if (el.lable == 'fileName') {
                        this.upgradeAray[0]['fileName'] = el.value;
                    }
                })
            }
            this.upgradeService.putDeviceAuth(this.upgradeAray, (data) => {
                this.onSubmitForm.emit();
            })
        }
    }

    key(event, dx) {
        let value = this.plformList[dx]['value'];
        if (this.plformList[dx]['lable'] == "build") {
            if (value.length <= 1) {
                value = value.match(/^[1-9]+$/g);
            } else {
                value = value.match(/[0-9]+/g);
            }
            if (value != null) {
                value = value.join('');
                if (value.length > 10) {
                    value = value.slice(0, 20)
                }
                this.plformList[dx]['value'] = value
            } else {
                this.plformList[dx]['value'] = ''
            }
        }
        if (this.plformList[dx]['lable'] == "version") {
            value = value.match(/[.0-9]+/g);
            if (value != null) {
                value = value.join('');
                if (value.length > 10) {
                    value = value.slice(0, 10)
                }
                this.plformList[dx]['value'] = value
            } else {
                this.plformList[dx]['value'] = ''
            }
        }
    }
}