import {BsModalRef} from 'ngx-bootstrap';
import {Component} from '@angular/core';
import {UsersService} from '../../features/personnel/users/users.service';
import {NativeToastrService} from '../../../common/native.toastr.service';

@Component({
    selector: 'atnd-user-reset-password',
    template: `
        <form class="m-t form-horizontal" role="form" name="form"
              (ngSubmit)="usersForm.form.valid && resetUserPwd()"
              #usersForm="ngForm"
              novalidate>
            <div class="modal-header" style="margin-top: -20px;">
                <h4 class="modal-title pull-left">修改密码</h4>
                <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="col-sm-2 control-label">原密码</label>
                    <div class="col-sm-10">
                        <input type="password" class="form-control" name="oldPassword"
                               [(ngModel)]="resetUser.oldPassword" #oldPassword="ngModel"
                               (change)="resetUser.oldPassword=resetUser.oldPassword.trim()"
                               maxlength="30"
                               placeholder="请输入原密码"
                               [required]="true"/>
                        <span class="help-block m-b-none text text-warning"
                              *ngIf="showTextWarning(resetUser.oldPassword,'oldPassword')">
                             * {{resetUser.oldPassword ? errorMessage[errorCode] : '原密码为必填项'}} 
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">新密码</label>
                    <div class="col-sm-10">
                        <input type="password" class="form-control" name="newPassword"
                               [(ngModel)]="resetUser.newPassword" #newPassword="ngModel"
                               (change)="resetUser.newPassword=resetUser.newPassword.trim()"
                               maxlength="30"
                               placeholder="请输入新密码"
                               [required]="true"/>
                        <span class="help-block m-b-none text text-warning"
                              *ngIf="showTextWarning(resetUser.newPassword,'newPassword')"> 
                             * {{resetUser.newPassword ? errorMessage[errorCode] : '新密码为必填项'}}
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">确认密码</label>
                    <div class="col-sm-10">
                        <input type="password" class="form-control" name="confirmPassword"
                               [(ngModel)]="resetUser.confirmPassword" #confirmPassword="ngModel"
                               (change)="resetUser.confirmPassword=resetUser.confirmPassword.trim()"
                               maxlength="30"
                               placeholder="请输入新密码"
                               [required]="true"/>
                        <span class="help-block m-b-none text text-warning"
                              *ngIf="showTextWarning(resetUser.confirmPassword,'confirmPassword')">
                             * {{resetUser.confirmPassword ? errorMessage[errorCode] : '确认密码为必填项'}}
                        </span>
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

export class ResetPasswordComponent {
    resetUser: any = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
    errorCode: string;
    errorMessage: any = {
        code_1: '新密码不能为空',
        code_2: '原密码不能为空',
        code_3: '新旧密码不能相同',
        code_4: '原密码错误',
        code_5: '当前用户不支持密码修改',
        code_6: '两次密码不一致'
    };

    constructor(public bsModalRef: BsModalRef,
                public usersService: UsersService,
                private nativeToastrService: NativeToastrService) {
    }

    resetUserPwd() {
        if (this.resetUser.newPassword === this.resetUser.oldPassword) {
            this.errorCode = 'code_3';
            return;
        }
        if (this.resetUser.newPassword != this.resetUser.confirmPassword) {
            this.errorCode = 'code_6';
            return;
        }
        let thisComponent = this;
        this.usersService.resetPassword(this.resetUser, function (result) {
            if (0 === Number(result)) {
                thisComponent.nativeToastrService.clearToastr();
                thisComponent.nativeToastrService.showSuccess('密码成功');
                thisComponent.bsModalRef.hide();
            } else {
                thisComponent.errorCode = 'code_' + result;
            }
        })
    }

    showTextWarning(value, type) {
        if (!value) {
            this.errorCode = '';
            return true;
        }
        if (this.errorCode) {
            if (type === 'oldPassword') {
                return this.errorCode === 'code_2' || this.errorCode === 'code_4' || this.errorCode === 'code_5';
            } else if (type === 'newPassword') {
                return this.errorCode === 'code_1' || this.errorCode === 'code_3' || this.errorCode === 'code_6';
            } else if (type === 'confirmPassword') {
                return this.errorCode === 'code_6';
            }
        } else {
            return !value;
        }
    }
}

