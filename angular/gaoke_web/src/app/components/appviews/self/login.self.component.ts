import {Component, OnInit} from '@angular/core';
import {Constants} from '../../../common/constants';
import {UsersService} from '../../features/personnel/users/users.service';
import {NativeToastrService} from '../../../common/native.toastr.service';
import {SpinService} from '../../../common/spin/spin.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ResetPasswordComponent} from './reset.password.component';

@Component({
    selector: 'atnd-login-self',
    templateUrl: 'login.self.template.html'
})
export class LoginSelfComponent implements OnInit {

    loginUser: any = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';
    isSave: boolean = false;
    bsModalRef: BsModalRef;

    getLoginUserInfo() {
        if (this.loginUser == 'loginUser') {
            this.callSelf();
        }
    }

    callSelf() {
        this.isSave = true;
        let thisComponent = this;
        this.usersService.getSelf(function (result) {
            Constants.loginUser = JSON.stringify(result);
            thisComponent.loginUser = result;
            if (thisComponent.loginUser.loginId) {
                thisComponent.loginUser.password = thisComponent.loginUser.userId + '';
            }
        });
    }

    ngOnInit(): void {
        if (this.loginUser && this.loginUser.loginId) {
            this.loginUser.password = this.loginUser.userId + '';
        }
        this.getLoginUserInfo();
    }

    constructor(private usersService: UsersService,
                private nativeToastrService: NativeToastrService,
                private spinService: SpinService,
                private modalService: BsModalService) {
    }

    updateUser() {
        let commonPwd = this.loginUser.userId + '';
        if (this.loginUser.password === commonPwd) {
            this.loginUser.password = '';
        }
        this.isSave = false;
        let thisComponent = this;
        this.spinService.spin(true);
        this.usersService.updateData(this.loginUser, function (success) {
            thisComponent.nativeToastrService.clearToastr();
            thisComponent.nativeToastrService.showSuccess('更新个人信息成功');
            thisComponent.spinService.spin(false);
            thisComponent.callSelf();
        })
    }

    resetPassword() {
        this.bsModalRef = this.modalService.show(ResetPasswordComponent, {});
    }
}
