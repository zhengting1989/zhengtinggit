import {BsModalRef} from 'ngx-bootstrap';
import {Component} from '@angular/core';
import { Constants } from '../../../../common/constants';

@Component({
    selector: 'atnd-users-detail',
    template: `
        <div style="padding: 15px 15px;">
            <div class="row">
                <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="row m-b-lg m-t-lg">
                    <div class="col-md-5">
                        <div class="col-md-12">
                            <div class="profile-image">
                                <img src="assets/images/profile_small.jpg" class="img-circle circle-border m-b-md" alt="profile">
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div>
                                <h2 class="no-margins">
                                    {{userInfo?.userName}}
                                </h2>
                                <h4 *ngIf="userInfo.entryDate">入职日期 : {{userInfo?.entryDate}}</h4>
                                <small>
                                    {{userInfo?.remark}}
                                </small>
                            </div>
                        </div>
                        <div class="col-md-12" style="margin-top: 20px;">
                            <span class="label label-warning pull-right" *ngIf="userInfo.locked">
                                账号已锁定
                            </span>
                            <span class="label label-primary pull-right" *ngIf="!userInfo.locked">
                                账号已激活
                            </span>
                        </div>
                        <div class="col-md-12" style="margin-top: 20px;">
                            <span class="label label-danger pull-right" *ngIf="!userInfo.status">
                                离职
                            </span>
                            <span class="label label-primary pull-right" *ngIf="userInfo.status">
                                在职
                            </span>
                        </div>
                        <div class="col-md-12" style="margin-top: 20px;">
                            <span class="label label-warning pull-right" *ngIf="!userInfo?.clockIn">
                                不打卡
                            </span>
                            <span class="label label-primary pull-right" *ngIf="userInfo?.clockIn">
                                打卡
                            </span>
                        </div>
                        <div class="col-md-12" style="display: none;">
                            <!-- These attributes are used by JavaFX client integration, don't change below code!!!  -->
                            <input id="javafx_client_user_id" [(ngModel)]="userInfo.userId" readonly/>
                            <input id="javafx_client_login_id" [(ngModel)]="loginUser.userId" readonly/>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <table class="table m-b-xs">
                            <tbody>
                            <tr>
                                <td>
                                    <strong>{{userInfo.sex ? '男' : '女'}}</strong><br/> 性别
                                </td>
                                <td>
                                    <strong>{{userInfo?.loginId}}</strong><br/> 登录账号
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>{{userInfo.userNo}}</strong><br/> 员工号
                                </td>
                                <td>
                                    <strong>{{userInfo?.clientId}}</strong><br/> 硬件客户端员工ID
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>{{userInfo.phone}}</strong><br/> 联系方式
                                </td>
                                <td>
                                    <strong>{{userInfo?.email}}</strong><br/> 电子邮箱
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    左手掌静脉&nbsp;
                                    <span class="label"
                                          [ngClass]="{' label-primary':userInfo?.enterLeftHand,'label-danger':!userInfo?.enterLeftHand}">
                                        {{userInfo?.enterLeftHand ? '已录入' : '未录入'}}
                                    </span>
                                </td>
                                <td>
                                    右手掌静脉&nbsp;
                                    <span class="label"
                                          [ngClass]="{' label-primary':userInfo?.enterRightHand,'label-danger':!userInfo?.enterRightHand}">
                                        {{userInfo?.enterRightHand ? '已录入' : '未录入'}}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="100%">
                                    <strong>{{userInfo?.idnumber}}</strong><br/> 身份证号码
                                </td>
                            </tr>
                            <tr>
                                <td colspan="100%">
                                    <strong>{{userInfo?.address}}</strong>
                                    <br/>户口所在地
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    `
})

export class UsersDetailComponent {
    nodeModel: any;
    userInfo: any;
    loginUser: any = Constants.loginUser !== 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';

    constructor(public bsModalRef: BsModalRef) {
    }
}

