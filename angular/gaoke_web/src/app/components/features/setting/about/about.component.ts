import {Component} from '@angular/core';
import {AboutService} from './about.service';
import {DynamicTableOption} from '../../../../common/components/dynamicTable/dynamic.table.option';
import {Constants} from '../../../../common/constants';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AboutDetailComponent} from './about.detail.component';

@Component({
    selector: 'atnd-setting-about',
    template: `
        <div class="wrapper wrapper-content">
            <div class="row  white-bg">
                <atnd-dynamic-table
                        [checkBox]="checkBox"
                        [columns]="columns"
                        [perPageNo]="50"
                        [tableOption]="tableOption"
                        (singleCallback)="singleCallback($event)"
                        [commonTableService]="aboutService">
                </atnd-dynamic-table>
            </div>
        </div>
    `
})
export class AboutComponent {
    bsModalRef: BsModalRef;
    checkBox: boolean = Constants.access;
    columns = [
        {
            type: 'text',
            name: '属性key值',
            value: 'key',
            orderBy: 'DESC',
            required: true,
            onlyAdd: true,
            maxlength: 50
        },
        {
            type: 'text',
            name: '属性名称',
            value: 'label',
            orderBy: 'DESC',
            required: true,
            maxlength: 50
        },
        {
            type: 'text',
            name: '属性内容',
            value: 'value',
            orderBy: 'DESC',
            required: true,
            maxlength: 3000
        },
        {
            type: 'text',
            name: '属性描述',
            value: 'comments',
            orderBy: 'DESC'
        }
    ];

    tableOption: DynamicTableOption = {
        addBtn: true,
        delBtn: true,
        putBtn: true,
        searchBtn: true,
        searchPlaceholder: '请按照关键字(属性key值/名称/内容)进行搜索'
    };

    public constructor(public aboutService: AboutService,
                       private modalService: BsModalService) {
    }

    singleCallback(event) {
        this.bsModalRef = this.modalService.show(AboutDetailComponent, {});
    }
}
