import {BsModalRef} from 'ngx-bootstrap';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UsersService} from './users.service';
import {AlertService} from '../../../../common/alert.service';
import {Constants} from '../../../../common/constants';

@Component({
    selector: 'atnd-users-form',
    template: `
        <form class="m-t form-horizontal" role="form" name="form"
              (ngSubmit)="usersForm.form.valid && saveUser()"
              #usersForm="ngForm"
              novalidate>
            <div class="modal-header" style="margin-top: -20px;">
                <h4 class="modal-title pull-left">{{isUpdate ? '修改用户' : '新增用户'}}</h4>
                <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="col-sm-2 control-label">用户身份</label>
                    <div class="col-sm-10">
                        <select class="form-control" name="admin"
                                #admin="ngModel" required
                                [(ngModel)]="formUser.admin">
                            <option [ngValue]="true"> 管理员</option>
                            <option [ngValue]="false"> 普通员工</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">员工号</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="userNo"
                               [(ngModel)]="formUser.userNo" #userNo="ngModel"
                               maxlength="30"
                               (change)="formUser.userNo=formUser.userNo.trim()"
                               placeholder="请输入员工号"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">姓名</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="userName"
                               [(ngModel)]="formUser.userName" #userName="ngModel"
                               (change)="formUser.userName=formUser.userName.trim()"
                               maxlength="30"
                               placeholder="请输入姓名" required/>
                        <span class="help-block m-b-none text text-warning" *ngIf="!formUser?.userName">
                             * 姓名为必填项
                        </span>
                    </div>
                </div>
                <div class="form-group" *ngIf="canUpdatePwd">
                    <label class="col-sm-2 control-label">登录账号</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="loginId"
                               [(ngModel)]="formUser.loginId" #loginId="ngModel"
                               (change)="formUser.loginId=formUser.loginId.trim()"
                               maxlength="30"
                               placeholder="请输入登录账号"
                               [required]="requiredInput(formUser,'loginId')"/>
                        <span class="help-block m-b-none text text-warning" *ngIf="showTextWarning(formUser,'loginId')">
                             * 登录账号为必填项
                        </span>
                        <span class="help-block m-b-none text text-danger">
                             {{ checkLoginResult ? '* 此账号已存在,请更换账号' : '' }}
                        </span>
                    </div>
                </div>
                <div class="form-group" *ngIf="canUpdatePwd">
                    <label class="col-sm-2 control-label">密码</label>
                    <div class="col-sm-10">
                        <input type="password" class="form-control" name="password"
                               [(ngModel)]="formUser.password" #password="ngModel"
                               (change)="formUser.password=formUser.password.trim()"
                               maxlength="30"
                               placeholder="请输入密码"
                               [required]="requiredInput(formUser,'password')"/>
                        <span class="help-block m-b-none text text-warning" *ngIf="showTextWarning(formUser,'password')">
                             * 密码为必填项
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">联系方式</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="phone"
                               [(ngModel)]="formUser.phone" #phone="ngModel"
                               (change)="formUser.phone=formUser.phone.trim()"
                               maxlength="20"
                               placeholder="请输入联系方式"/>
                        <span class="help-block m-b-none text text-warning" *ngIf="formUser?.phone && phoneWarningTip">
                             * {{phoneWarningTip}}
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">身份证号码</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="idnumber"
                               maxlength="50"
                               [(ngModel)]="formUser.idnumber" #idnumber="ngModel"
                               (change)="formUser.idnumber=formUser.idnumber.trim()"
                               placeholder="请输入身份证号码"/>
                        <span class="help-block m-b-none text text-warning" *ngIf="formUser?.idnumber && idnumberWarningTip">
                             * {{idnumberWarningTip}}
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">户口所在地</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="address"
                               [(ngModel)]="formUser.address" #address="ngModel"
                               (change)="formUser.address=formUser.address.trim()"
                               maxlength="255"
                               placeholder="请输入户口所在地"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">邮箱</label>
                    <div class="col-sm-10">
                        <input type="email" class="form-control" name="email"
                               [(ngModel)]="formUser.email" #email="ngModel"
                               maxlength="255"
                               (change)="formUser.email=formUser.email.trim()"
                               placeholder="请输入邮箱"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">性别</label>
                    <div class="col-sm-10">
                        <select class="form-control" name="sex"
                                #sex="ngModel" required
                                [(ngModel)]="formUser.sex">
                            <option [ngValue]="true"> 男</option>
                            <option [ngValue]="false"> 女</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">是否锁定</label>
                    <div class="col-sm-10">
                        <select class="form-control" name="locked"
                                #locked="ngModel" required
                                [(ngModel)]="formUser.locked">
                            <option [ngValue]="false"> 不锁定</option>
                            <option [ngValue]="true"> 锁定</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">状态</label>
                    <div class="col-sm-10">
                        <select class="form-control" name="status"
                                #status="ngModel" required
                                [(ngModel)]="formUser.status">
                            <option [ngValue]="true"> 在职</option>
                            <option [ngValue]="false"> 离职</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">是否打卡</label>
                    <div class="col-sm-10">
                        <select class="form-control" name="clockIn"
                                #clockIn="ngModel" required
                                [(ngModel)]="formUser.clockIn">
                            <option [ngValue]="true"> 打卡</option>
                            <option [ngValue]="false"> 不打卡</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-info"
                        [disabled]="!usersForm.form.valid">保存
                </button>
                <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">关闭</button>
            </div>
        </form>
    `
})

export class UsersFormComponent implements OnInit {


    ngOnInit(): void {
        this.canUpdatePwd = true;
        if (this.isUpdate) {
            this.userStatusStr = this.inputUser.status ? 'inLine' : 'isLeave';
            this.formUser = JSON.parse(JSON.stringify(this.inputUser));
            delete this.formUser.checked;
            if (this.formUser.loginId) {
                this.formUser.password = this.formUser.userId + '';
            }
            if (Constants.loginUser != 'loginUser') {
                this.canUpdatePwd = JSON.parse(Constants.loginUser).admin;
            }
        }
        window.addEventListener('popstate', () => {
            this.bsModalRef.hide();
        });
    }

    canUpdatePwd: boolean = false;
    checkLoginResult: boolean = false;
    isUpdate: boolean = false;
    inputUser: any;
    formUser: any = {
        sex: true,
        admin: false,
        locked: false,
        status: true,
        clockIn: false
    };
    groupId: any;
    @Output() onSubmitForm = new EventEmitter();
    phoneWarningTip: string;
    idnumberWarningTip: string;
    userStatusStr: string = 'isLeave';

    constructor(public bsModalRef: BsModalRef,
                public usersService: UsersService,
                private alertService: AlertService) {
    }

    saveUser() {
        this.formUser['groupId'] = this.groupId;
        if (!this.phoneValid(this.formUser.phone)) {
            return;
        }
        if (!this.identityCodeValid(this.formUser.idnumber)) {
            return;
        }
        if (this.userStatusStr == 'inLine' && !this.formUser.status) {
            let thisComponent = this;
            let text: string = '确认更改用户状态为离职？此操作将移除与此用户用户相关的【设备授权】的信息！';
            thisComponent.alertService.showCallbackWarningAlert(function (result) {
                thisComponent.emitUser();
            }, function (result) {
                thisComponent.bsModalRef.hide();
            }, undefined, text);
        } else {
            this.emitUser();
        }
    }

    emitUser() {
        if (this.formUser.loginId) {
            let thisComponent = this;
            let payload = {loginId: this.formUser.loginId, userId: this.formUser.userId ? this.formUser.userId : ''};
            this.usersService.checkUserLogin(payload, function (result) {
                thisComponent.checkLoginResult = result;
                if (!result) {
                    let commonPwd = thisComponent.formUser.userId + '';
                    if (thisComponent.isUpdate && thisComponent.formUser.password === commonPwd) {
                        thisComponent.formUser.password = '';
                    }
                    thisComponent.onSubmitForm.emit(thisComponent.formUser);
                    thisComponent.bsModalRef.hide();
                }
            });
        } else {
            this.formUser.loginId = '';
            this.formUser.password = '';
            this.onSubmitForm.emit(this.formUser);
            this.bsModalRef.hide();
        }
    }


    showTextWarning(model, type): boolean {
        if (type === 'loginId') {
            return this.requiredInput(model, type) && !model.loginId;
        } else if (type === 'password') {
            return this.requiredInput(model, type) && !model.password;
        } else {
            return false;
        }
    }

    requiredInput(model, type): boolean {
        if (type === 'loginId') {
            if (model && model.admin) {
                return true;
            } else {
                return false;
            }
        } else if (type === 'password') {
            if (model && model.admin) {
                return true;
            } else if (model && !model.admin && model.loginId) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

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


    //身份证号合法性验证
    //支持15位和18位身份证号
    //支持地址编码、出生日期、校验位验证
    identityCodeValid(code): boolean {
        if (!code) {
            return true;
        }
        let city = {
            11: '北京',
            12: '天津',
            13: '河北',
            14: '山西',
            15: '内蒙古',
            21: '辽宁',
            22: '吉林',
            23: '黑龙江 ',
            31: '上海',
            32: '江苏',
            33: '浙江',
            34: '安徽',
            35: '福建',
            36: '江西',
            37: '山东',
            41: '河南',
            42: '湖北 ',
            43: '湖南',
            44: '广东',
            45: '广西',
            46: '海南',
            50: '重庆',
            51: '四川',
            52: '贵州',
            53: '云南',
            54: '西藏 ',
            61: '陕西',
            62: '甘肃',
            63: '青海',
            64: '宁夏',
            65: '新疆',
            71: '台湾',
            81: '香港',
            82: '澳门',
            91: '国外 '
        };
        if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/i.test(code)) {
            this.idnumberWarningTip = '身份证号格式错误！';
            return false;
        } else if (!city[code.substr(0, 2)]) {
            this.idnumberWarningTip = '地址编码错误！';
            return false;
        } else {
            //18位身份证需要验证最后一位校验位
            if (code.length == 18) {
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                //校验位
                let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                let sum = 0;
                let ai = 0;
                let wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if (last != code[17]) {
                    this.idnumberWarningTip = '校验位错误！';
                    return false;
                }
            }
            return true;
        }
    }

}

