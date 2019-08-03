import {BsModalRef} from 'ngx-bootstrap';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'atnd-login-choose-unification',
    template: `
        <div style="padding: 10px 0;margin: 0 0;">
            <div class="row" style="margin-top:  -10px;margin-bottom: 2px;">
                <div class="col-md-12">
                    <h4 style="padding: 10px 0 10px 16px;">
                        您现在有以下多个身份，请选择其中某个身份进行登录，登录后仅能使用该身份的权限。
                    </h4>
                </div>
            </div>
            <div class="row contactWrap" style="max-height: 600px;overflow: hidden;overflow-y: auto;margin: 0 0;">
                <div class="col-lg-4">
                    <div class="contact-box center-version" *ngFor="let chooseUnification of leftUnifications;">
                        <a (click)="chooseThis(chooseUnification)" data-toggle="tooltip" title="{{chooseUnification?.unificationName}}">

                            <img alt="image" class="img-circle img-md"
                                 *ngIf="!chooseUnification?.faIcon"
                                 src="assets/images/{{chooseUnification?.unificationType}}.png">
                            <img alt="image" class="img-circle img-md"
                                 *ngIf="chooseUnification?.faIcon"
                                 [src]="'data:image/jpg;base64,' +  chooseUnification?.faIcon">
                            <h3 class="m-b-xs"><strong>{{showUnificationType(chooseUnification?.unificationType)}}</strong></h3>
                            <div class="font-bold">{{chooseUnification?.unificationName}}</div>
                        </a>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="contact-box center-version" *ngFor="let chooseUnification of centerUnifications;">
                        <a (click)="chooseThis(chooseUnification)" data-toggle="tooltip" title="{{chooseUnification?.unificationName}}">

                            <img alt="image" class="img-circle img-md"
                                 *ngIf="!chooseUnification?.faIcon"
                                 src="assets/images/{{chooseUnification?.unificationType}}.png">
                            <img alt="image" class="img-circle img-md"
                                 *ngIf="chooseUnification?.faIcon"
                                 [src]="'data:image/jpg;base64,' +  chooseUnification?.faIcon">
                            <h3 class="m-b-xs"><strong>{{showUnificationType(chooseUnification?.unificationType)}}</strong></h3>
                            <div class="font-bold">{{chooseUnification?.unificationName}}</div>
                        </a>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="contact-box center-version" *ngFor="let chooseUnification of rightUnifications;">
                        <a (click)="chooseThis(chooseUnification)" data-toggle="tooltip" title="{{chooseUnification?.unificationName}}">
                            <img alt="image" class="img-circle img-md"
                                 *ngIf="!chooseUnification?.faIcon"
                                 src="assets/images/{{chooseUnification?.unificationType}}.png">

                            <img alt="image" class="img-circle img-md"
                                 *ngIf="chooseUnification?.faIcon"
                                 [src]="'data:image/jpg;base64,' +  chooseUnification?.faIcon">
                            <h3 class="m-b-xs"><strong>{{showUnificationType(chooseUnification?.unificationType)}}</strong></h3>
                            <div class="font-bold">{{chooseUnification?.unificationName}}</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./login.template.scss']
})

export class ChooseUnificationComponent implements OnInit {

    chooseUnifications: any;
    leftUnifications: any;
    centerUnifications: any;
    rightUnifications: any;
    @Output() onChoose = new EventEmitter();

    constructor(public bsModalRef: BsModalRef) {

    }


    showUnificationType(nodeType: string): string {
        let nodeTypeTitle = '';
        switch (nodeType) {
            case 'group':
                nodeTypeTitle = '部门';
                break;
            case 'property':
                nodeTypeTitle = '物业';
                break;
            case 'platform':
                nodeTypeTitle = '平台';
                break;
            case 'project':
                nodeTypeTitle = '项目';
                break;
            default:
                nodeTypeTitle = '未知';
                break;
        }
        return nodeTypeTitle;
    }

    chooseThis(chooseUnification) {
        this.onChoose.emit(chooseUnification);
        this.bsModalRef.hide();
    }
    
    ngOnInit() {
        window.addEventListener('popstate', () => {
            this.bsModalRef.hide();
        });
        this.chooseUnifications = this.chooseUnifications || [];
        this.leftUnifications = [];
        this.centerUnifications = [];
        this.rightUnifications = [];
        for (let idx = 0, length = this.chooseUnifications.length; idx < length; idx++) {
            let flag = idx % 3;
            if (flag === 0) {
                this.leftUnifications.push(this.chooseUnifications[idx]);
            } else if (flag === 1) {
                this.centerUnifications.push(this.chooseUnifications[idx]);
            } else if (flag === 2) {
                this.rightUnifications.push(this.chooseUnifications[idx]);
            }
        }
    }
}

