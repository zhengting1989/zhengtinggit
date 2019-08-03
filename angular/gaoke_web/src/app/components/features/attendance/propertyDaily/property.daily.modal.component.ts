import {Component} from "@angular/core";
import {BsModalRef} from "ngx-bootstrap";

declare var jQuery: any;

@Component({
    selector: "atnd-property-daily-module",
    templateUrl: "property.daily.modal.template.html",
    styleUrls: ["./property.daily.template.scss"]
})
export class PropertyDailyModuleComponent {
    public constructor(public bsModalRef: BsModalRef) {
    }

    timelist: any;

    ngOnInit(): void {

        window.addEventListener("popstate", () => {
            this.bsModalRef.hide();
        });
        let height = document.body.clientHeight;
        let topnavbarheight = jQuery(".navbar").height();
        jQuery("#modal-body").css({'max-height': height - topnavbarheight - 160});
        jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        window.onresize = () => {
            let height = document.body.clientHeight;
            let topnavbarheight = jQuery(".navbar").height();
            jQuery("#modal-body").css({'max-height': height - topnavbarheight - 160});
            jQuery("#parRowWraper").height(height - topnavbarheight - 160);
        };
    }

    HSformat(ms) {
        return new Date(ms).toLocaleString().slice(9);
    }
    timeFormat(ms) {
        if (ms) {
            return new Date(ms).toString().slice(16,25);;
        } else {
            return "";
        }
    }
}
