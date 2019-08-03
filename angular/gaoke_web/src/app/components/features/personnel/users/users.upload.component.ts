import {BsModalRef} from 'ngx-bootstrap';
import {Component, EventEmitter, Output} from '@angular/core';
import {AlertService} from '../../../../common/alert.service';

@Component({
    selector: 'atnd-users-upload',
    template: `
        <div class="modal-header">
            <h4 class="modal-title pull-left">批量导入用户</h4>
            <button type="button"
                    class="close pull-right"
                    aria-label="Close"
                    (click)="bsModalRef.hide()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="row ">
                <alert type="info">
                    <strong>提示语：</strong> 仅将用户导入【<strong>{{unificationName}}</strong>】的内置分组【<strong>未分组</strong>】下
                </alert>
                <alert type="warning">
                    <strong>excel格式及要求</strong> &nbsp; *（为必填项）、性别（男/女） 
                </alert>
                <div class="form-group">
                    <label class="col-sm-2 control-label">选择上传Excel</label>
                    <div class="col-sm-10">
                        <input type="file" class="form-control"
                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                               name="filePicker" id="filePicker"
                               (change)="handleFileInput($event.target.files)"
                               required>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-info"
                    (click)="downloadExcelTemp()">下载模板
            </button>
            <button type="button" class="btn btn-info"
                    (click)="uploadUser()"
                    [disabled]="!isFileInputChange">上传
            </button>
            <button type="button" class="btn btn-default"
                    (click)="bsModalRef.hide()">
                关闭
            </button>
        </div>
    `
})

export class UsersUploadComponent {

    constructor(public bsModalRef: BsModalRef,
                private alertService: AlertService) {
    }

    isFileInputChange: boolean = false;
    unificationName: string;
    fileToUpload: File = null;
    @Output() onUploadUsers = new EventEmitter();
    formData: FormData = new FormData();
    ngOnInit(): void {
        window.addEventListener("popstate", ()=> {
            this.bsModalRef.hide();    
        });
    }
    handleFileInput(files: FileList) {
        this.isFileInputChange = true;
        this.fileToUpload = files.item(0);
        this.formData.append('usersUpload', this.fileToUpload, this.fileToUpload.name);
    }

    uploadUser() {
        let thisComponent = this;
        let title: string = '确认批量导入?';
        let text: string = '您现在使用的是手动导入功能，请确认是否已导入过该文件。如果重复导入，会导致重复用户信息。是否继续？';
        thisComponent.alertService.showCallbackWarningAlert(function (result) {
            thisComponent.onUploadUsers.emit(thisComponent.formData);
            thisComponent.bsModalRef.hide();
        }, function (result) {
            thisComponent.bsModalRef.hide();
        }, title, text);
    }

    downloadExcelTemp() {
        window.location.href = '/assets/templates/import_users.xlsx';
    }
}

