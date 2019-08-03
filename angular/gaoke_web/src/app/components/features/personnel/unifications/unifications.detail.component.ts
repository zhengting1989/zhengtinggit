import {BsModalRef} from 'ngx-bootstrap';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'atnd-unifications-detail',
    template: `
        <form class="m-t form-horizontal" role="form" name="form"
              (ngSubmit)="unificationForm.form.valid && addUnification()"
              #unificationForm="ngForm"
              novalidate>
            <div class="modal-header" style="margin-top: -20px;">
                <h4 class="modal-title pull-left">{{isUpdate ? '修改' : '新增' + (type === 'property' ? '项目' : '')}}</h4>
                <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group" *ngIf="showUnificationTypeDiv()">
                    <label class="col-sm-2 control-label">账号类别</label>
                    <div class="col-sm-10">
                        <select class="form-control" name="unificationType"
                                #unificationType="ngModel" required
                                [(ngModel)]="unificationInfo.unificationType">
                            <option value="property"> 物业</option>
                            <option value="platform"> 平台</option>
                            <option value="project"> 项目</option>
                        </select>
                    </div>
                </div>
                <div class="form-group" *ngIf="showParentUnificationTypeDiv()">
                    <label class="col-sm-2 control-label">所属物业</label>
                    <div class="col-sm-10" *ngIf="showParentUnification()">
                        <select class="form-control" name="parentUnificationId"
                                #parentUnificationId="ngModel" required
                                [(ngModel)]="unificationInfo.parentUnificationId">
                            <option [value]="property.unificationId" *ngFor="let property of propertys;">
                                {{property.unificationName}}
                            </option>
                        </select>
                        <span class="help-block m-b-none text text-warning"
                              *ngIf="unificationInfo?.parentUnificationId != '0' &&!unificationInfo?.parentUnificationId">
                             * 所属物业为必选项
                        </span>
                    </div>
                    <div class="col-sm-10" *ngIf="!showParentUnification()">
                        <input type="text" class="form-control"
                               id="update-unificationInfo-parentUnificationName"
                               name="update-unificationInfo-parentUnificationName"
                               value="{{unificationInfo?.parentUnificationName? unificationInfo?.parentUnificationName:'' }}"
                               readonly>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">账号名称</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="unificationName"
                               [(ngModel)]="unificationInfo.unificationName" #unificationName="ngModel"
                               (change)="unificationInfo.unificationName=unificationInfo.unificationName.trim()"
                               maxlength="30"
                               placeholder="请输入账号名称" required/>
                        <span class="help-block m-b-none text text-warning" *ngIf="!unificationInfo?.unificationName">
                             * 账号名称为必填项
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">所在地</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="address"
                               [(ngModel)]="unificationInfo.address" #address="ngModel"
                               maxlength="255"
                               (change)="unificationInfo.address=unificationInfo.address.trim()"
                               placeholder="请输入所在地" required/>
                        <span class="help-block m-b-none text text-warning" *ngIf="!unificationInfo?.address">
                             * 所在地为必填项
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">账号简称</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="shortName"
                               [(ngModel)]="unificationInfo.shortName" #shortName="ngModel"
                               maxlength="30"
                               (change)="unificationInfo.shortName=unificationInfo.shortName.trim()"
                               placeholder="请输入账号简称" required/>
                        <span class="help-block m-b-none text text-warning" *ngIf="!unificationInfo?.shortName">
                             * 账号简称为必填项
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">联系人</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="contactName"
                               [(ngModel)]="unificationInfo.contactName" #contactName="ngModel"
                               maxlength="30"
                               (change)="unificationInfo.contactName=unificationInfo.contactName.trim()"
                               placeholder="请输入联系人" required/>
                        <span class="help-block m-b-none text text-warning" *ngIf="!unificationInfo?.contactName">
                             * 联系人为必填项
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">联系电话</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="contactPhone"
                               [(ngModel)]="unificationInfo.contactPhone" #contactPhone="ngModel"
                               (change)="unificationInfo.contactPhone=unificationInfo.contactPhone.trim()"
                               maxlength="20"
                               placeholder="请输入联系电话" required/>
                        <span class="help-block m-b-none text text-warning" *ngIf="!unificationInfo?.contactPhone">
                             * 联系电话为必填项
                        </span>
                        <span class="help-block m-b-none text text-warning" *ngIf="unificationInfo?.contactPhone && phoneWarningTip">
                             * {{phoneWarningTip}}
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">账号图标</label>
                    <div [ngClass]="{'col-sm-2': unificationInfo?.faIcon}" *ngIf="unificationInfo?.faIcon">
                        <img [src]="'data:image/jpg;base64,' + unificationInfo?.faIcon" class="img-rounded img-md">
                    </div>
                    <div [ngClass]="{'col-sm-8': unificationInfo?.faIcon,'col-sm-10': !unificationInfo?.faIcon}">
                        <input type="file" class="form-control"
                               accept="image/*"
                               name="filePicker" id="filePicker"
                               (change)="handleFileSelect($event)">
                        <span class="help-block m-b-none text text-warning" *ngIf="fileChangeError">
                             * 文件只能够上传jpg、jpeg、png类型的文件
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">备注</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" name="comment" style="resize: none;"
                                  [(ngModel)]="unificationInfo.comment" #comment="ngModel"
                                  (change)="unificationInfo.comment=unificationInfo.comment.trim()"
                                  placeholder="请填写备注" rows="5" cols="120">                             
                        </textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-info"
                        [disabled]="!unificationForm.form.valid">保存
                </button>
                <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">关闭</button>
            </div>
        </form>
    `
})

export class UnificationsDetailComponent implements OnInit {

    propertys: any;
    isUpdate: boolean;
    unificationInfo: any;
    type: string = '';

    showParentUnification(): boolean {
        return this.type && this.type != 'project';
    }

    showUnificationTypeDiv(): boolean {
        let bn = (!this.isUpdate) && this.type && this.type === 'platform';
        return bn;
    }

    showParentUnificationTypeDiv(): boolean {
        return this.type === 'platform' && this.unificationInfo.unificationType === 'project';
    }

    @Output() onSubmitForm = new EventEmitter();

    ngOnInit(): void {
        window.addEventListener("popstate", ()=> {
            this.bsModalRef.hide();    
        });
        this.oldFaIcon = this.isUpdate ? this.unificationInfo.faIcon : undefined;
    }

    constructor(public bsModalRef: BsModalRef) {
    }

    addUnification() {
        if (!this.phoneValid(this.unificationInfo.contactPhone)) {
            return;
        }
        if (this.fileChangeError) {
            return;
        }
        if ((!this.isUpdate) && this.type && this.type === 'property') {
            this.unificationInfo.unificationType = 'project';
        }
        this.onSubmitForm.emit(this.unificationInfo);
        this.bsModalRef.hide();
    }

    oldFaIcon: any;
    fileChangeError: boolean = false;

    handleFileSelect(evt) {
        this.fileChangeError = false;
        let files = evt.target.files;
        let file = files[0];
        if (files && file) {
            let nameSplit: string[] = file.name.split('.');
            if (nameSplit && nameSplit.length > 0) {
                let fileType: string = nameSplit[nameSplit.length - 1];
                fileType = fileType.toLowerCase();
                let idx = '*.jpg.jpeg.png'.indexOf('.' + fileType);
                if (idx > 0) {
                    let reader = new FileReader();
                    reader.onload = this._handleReaderLoaded.bind(this);
                    reader.readAsBinaryString(file);
                } else {
                    this.unificationInfo.faIcon = this.oldFaIcon;
                    this.fileChangeError = true;
                }
            }
        } else {
            this.unificationInfo.faIcon = this.oldFaIcon;
        }
    }

    _handleReaderLoaded(readerEvt) {
        let binaryString = readerEvt.target.result;
        this.unificationInfo.faIcon = btoa(binaryString);
    }

    phoneWarningTip: string;

    phoneValid(phone): boolean {
        if (!phone) {
            return true;
        }
        let phoneReg = /^(0|86|17951)?(13[0-9]|14[5,7,9]|15[^4]|18[0-9]|17[0,1,3,5,6,7,8])[0-9]{8}$/;
        let telReg = /^(0\d{2,3}-\d{7,8})$/;
        let phoneMatch = phoneReg.test(phone);
        let telMatch = telReg.test(phone);
        if (phoneMatch || telMatch) {
            this.phoneWarningTip = undefined;
            return true;
        }
        this.phoneWarningTip = '联系电话校验失败，请输入正确的联系电话！';
        return false;
    }
}

