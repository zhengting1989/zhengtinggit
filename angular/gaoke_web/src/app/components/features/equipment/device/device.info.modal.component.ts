import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";
import { SpinService } from "../../../../common/spin/spin.service";
import { DeviceService } from "./device.service";

declare var jQuery: any;

@Component({
    selector: "atnd-device-info-module",
    templateUrl: "device.info.modal.template.html",
    styleUrls: ["./device.template.scss"]
})
export class DeviceInfoModuleComponent {
    public constructor(public bsModalRef: BsModalRef,
        public spinService: SpinService,
        public deviceService: DeviceService
    ) {
    }
    keyword: string = '';
    deviceTable: any = [];
    keyWords: string;
    perPagNo: number = 50;
    pageIndex: number = 1;
    total: Number = 0;

    ngOnInit(): void {
        this.search()
        window.addEventListener("popstate", () => {
            this.bsModalRef.hide();
        });
        let height = document.body.clientHeight;
        let topnavbarheight = jQuery(".navbar").height();
        jQuery("#modal-body").css({ 'max-height': height - topnavbarheight - 160 });
        jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        window.onresize = () => {
            let height = document.body.clientHeight;
            let topnavbarheight = jQuery(".navbar").height();
            jQuery("#modal-body").css({ 'max-height': height - topnavbarheight - 160 });
            jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        };
    }
    enterSearch(e) {
        if (e.keyCode == 13) {
            this.search(e);
        }
    }
    search(e?) {
        this.spinService.spin(true);
        if(e){
           this.pageIndex = 1; 
           this.total = 0;
        }
        let parm: any = {
            pageIndex: this.pageIndex,
            perPageNo: this.perPagNo,
            keyword: this.keyword
        }
        this.deviceTable = [];
        this.deviceService.getAllDevice(parm, (data) => {
            this.spinService.spin(false);
            this.deviceTable = data.data;
            this.total = data.totalNumbers
        })
    }

    //分页代码修改
    onPaginationChanged(event) {
        this.perPagNo = Number(event.perPageNo);
        this.pageIndex = Number(event.pageIndex);
        let perPageChange = event.perPageChange;
        if (perPageChange) {
            this.total = 0;
        }
        this.search();
    }
}
