import {Component, EventEmitter,Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
    selector: 'atnd-groups-user-operate-confirm',
    template: `
        <div class="modal-header">
            <h4 class="modal-title pull-left">{{isPlus ? '添加用户到部门' : '移除部门用户'}}</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body row">
            <h2>部门 : {{nodeModel?.name}}</h2>
            <h5 class="tag-title">待处理用户</h5>
            <ul class="tag-list" style="padding: 0">
                <li *ngFor="let selectedUser of selectedUsers;">
                    <a>
                        {{selectedUser?.userName}}&nbsp;{{showLoginId(selectedUser?.loginId)}}
                    </a>
                </li>
            </ul>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">关闭</button>
            <button type="button" class="btn btn-primary"
                    *ngIf="selectedUsers.length > 0 "
                    (click)="toConfirm()">
                {{isPlus ? '确认添加' : '确认移除'}}
            </button>
        </div>
    `
})
export class GroupUserOperateConfirmComponent {

    selectedUsers: any;
    isPlus: boolean;
    nodeModel: any;

    @Output() onConfirm = new EventEmitter();

    constructor(public bsModalRef: BsModalRef) {
    }

    toConfirm() {
        this.selectedUsers = this.selectedUsers || [];
        let selectedUserIds = [];
        this.selectedUsers.forEach(function (selectedUser) {
            selectedUserIds.push(selectedUser.userId)
        });
        this.onConfirm.emit({userIds: selectedUserIds, groupId: this.nodeModel.nodeId});
        this.bsModalRef.hide();
    }

    showLoginId(loginId): string {
        if (loginId) {
            return '( ' + loginId + ' )';
        }
        return '';
    }
}

