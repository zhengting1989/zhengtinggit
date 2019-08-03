import {BsModalRef} from 'ngx-bootstrap';
import {Component} from '@angular/core';

@Component({
    selector: 'atnd-logs-detail',
    template: `
        <div class="modal-header">
            <h4 class="modal-title pull-left">日志明细</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form class=" form-horizontal">
                <div class="form-group">
                    <label class="col-sm-2 control-label">rest类型</label>
                    <div class="col-sm-10" [innerHTML]='formatter(detail?.requestMethod)'>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">rest路径</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="pathUrl"
                               value="{{detail?.pathUrl}}"
                               readonly/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">操作人</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="userName"
                               value="{{detail?.userName}}"
                               readonly/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">操作人ID</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="createUserId"
                               value="{{detail?.createUserId}}"
                               readonly/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">操作时间</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="createTime"
                               value="{{detail?.createTime}}"
                               readonly/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">操作描述</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="createTime"
                               value="{{detail?.description}}"
                               readonly/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">操作内容</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" name="content"
                                  style="resize: none;" rows="5" cols="120"
                                  value="{{detail?.content}}" readonly>                             
                        </textarea>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">关闭</button>
        </div>
    `
})

export class LogsDetailComponent {

    detail: any;
    ngOnInit(){
        window.addEventListener("popstate", ()=> {
            this.bsModalRef.hide();    
        });
     }
    formatter(value) {
        if (value === 'post') {
            return '<span class="label label-info">POST</span>'
        }
        if (value === 'put') {
            return '<span class="label label-warning">PUT</span>'
        }
        if (value === 'delete') {
            return '<span class="label label-danger">DELETE</span>'
        }
        return '<span class="label label-danger">未知</span>';
    }

    constructor(public bsModalRef: BsModalRef) {
    }
}

