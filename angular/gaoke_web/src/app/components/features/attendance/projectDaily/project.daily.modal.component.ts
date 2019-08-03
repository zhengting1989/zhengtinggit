import {Component} from "@angular/core";
import {BsModalRef} from "ngx-bootstrap";

declare var jQuery: any;

@Component({
    selector: "atnd-project-daily-module",
    templateUrl: "project.daily.modal.template.html",
    styleUrls: ["./project.daily.template.scss"]
})
export class ProjectDailyModuleComponent {
    public constructor(public bsModalRef: BsModalRef) {
    }

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
}
