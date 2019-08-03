import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonTableService} from './common.table.service';
import {DynamicFormComponent} from '../dynamicForm/dynamic.form.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {DynamicTableOption} from './dynamic.table.option';
import {DynamicTableDetailComponent} from './dynamic.table.detail.component';
import {AlertService} from '../../alert.service';
import {Constants} from '../../constants';

declare var jQuery: any;

@Component({
    selector: 'atnd-dynamic-table',
    templateUrl: 'dynamic.table.template.html',
    styles: ['.thionic:hover i{display:inline-block!important} .thionic>.fa{position:absolute;} .fa-sort-desc{top:5px;} .fa-sort-asc{top:11px;}']
})

export class DynamicTableComponent implements OnInit {

    @Input('queryParam') queryParam: any = {};
    @Input('cumSaveParam') cumSaveParam: any = {};
    @Input('columns') columns: any;
    @Input('commonTableService') commonTableService: CommonTableService;
    @Input('checkBox') checkBox: boolean = true;
    @Output('singleCallback') singleCallback = new EventEmitter<any>();
    @Output('checkboxClick') checkboxClick = new EventEmitter<any>();
    @Input('tableOption') tableOption: DynamicTableOption;
    @Input('perPageNo') perPageNo: number = 10;

    checkboxAll: boolean;
    countSingleCheckBox: number = 0;
    tbodyDatas: any = [];
    keyWords: string = '';
    total: number = 0;
    formModalRef: BsModalRef;
    pageIndex: number = 1;
    constructor(private modalService: BsModalService,
                private alertService: AlertService) {
    }

    onSingleMethod(singleMethod, data) {
        let back = {
            callbackTime: new Date(),
            singleMethod: singleMethod,
            data: data
        };
        this.singleCallback.emit(back);
    }

    onGlobalMethod(globalMethod) {
        let back = {
            callbackTime: new Date(),
            singleMethod: globalMethod,
            data: this.getCheckedData()
        };
        this.singleCallback.emit(back);
    }

    //分页代码修改
    onPaginationChanged(event) {
        let eventPerPagNo = Number(event.perPageNo);
        let eventPageIndex = Number(event.pageIndex);
        this.pageIndex = eventPageIndex;
        if (eventPerPagNo != this.perPageNo) {
            this.perPageNo = eventPerPagNo;
        }
        let querys = JSON.parse(JSON.stringify(this.queryParam));
        if (this.keyWords) {
            querys['keyword'] = this.keyWords;
        } else {
            querys['keyword'] = '';
        }
        querys['perPageNo'] = eventPerPagNo;
        querys['pageIndex'] = event.pageIndex;
        let perPageChange = event.perPageChange;
        let thisTableComponent = this;
        if (this.commonTableService) {
            if (perPageChange) {
                thisTableComponent.tbodyDatas = [];
                thisTableComponent.total = 0;
            }
            thisTableComponent.countSingleCheckBox = 0;
            thisTableComponent.checkboxAll = false;
            this.checkboxClick.emit(undefined);
            this.commonTableService.getData(querys, function (result) {
                thisTableComponent.tbodyDatas = result ? result.data || [] : [];
                if (perPageChange) {
                    thisTableComponent.total = result ? result.totalNumbers : 0;
                }
            });
        }
    }

    onChangeAllCheckBox(checked: boolean) {
        let thisTable = this;
        this.checkboxAll = checked;
        this.tbodyDatas.forEach(function (item) {
            item['checked'] = checked;
            if (checked) {
                thisTable.countSingleCheckBox++;
            } else {
                thisTable.countSingleCheckBox--;
            }
        });
        let checkedItems = this.getCheckedData();
        this.checkboxClick.emit(checkedItems);
    }

    onChangeSingleCheckBox(checked: boolean) {
        if (checked) {
            this.countSingleCheckBox++;
        } else {
            this.countSingleCheckBox--;
        }
        this.checkboxAll = this.tbodyDatas.length == this.countSingleCheckBox;
        let checkedItems = this.getCheckedData();
        this.checkboxClick.emit(checkedItems);
    }

    getCheckedData(): any {
        const checkBoxCheckedData = [];
        this.tbodyDatas.forEach(function (item) {
            if (item.checked) {
                checkBoxCheckedData.push(item);
            }
        });
        return checkBoxCheckedData;
    }

    ngOnInit(): void {
    }

    toSearch() {
        this.getData();
    }

    toSort(column, dx) {
        if (column.orderBy) {
            for (let i in this.columns) {
                if (this.columns[i].orderBy === 'ASC') {
                    jQuery('#sortIon' + i).css({'color': '#676a6c', 'display': 'none', 'top': '11px'});
                } else {
                    jQuery('#sortIon' + i).css({'color': '#676a6c', 'display': 'none', 'top': '5px'});
                }
            }
            let thisTableComponent = this;
            this.commonTableService.sortData(column, function (desc) {
                if (column.orderBy === 'ASC') {
                    column.orderBy = 'DESC';
                    jQuery('#sortIon' + dx).css({'color': '#137dea', 'display': 'inline-block', 'top': '5px'});
                } else {
                    column.orderBy = 'ASC';
                    jQuery('#sortIon' + dx).css({'color': '#137dea', 'display': 'inline-block', 'top': '11px'});
                }
                thisTableComponent.queryParam['orderParams'] = desc.value + '-' + desc.orderBy;
                thisTableComponent.getData();
            });
        }
    }

    toDeletes() {
        let thisComponent = this;
        let deleteMessage = this.tableOption ? this.tableOption.deleteMessage : undefined;
        let text: string = deleteMessage ? deleteMessage : '确认删除当前选中的内容';
        thisComponent.alertService.showCallbackWarningAlert(function (alertResult) {
            thisComponent.countSingleCheckBox = 0;
            thisComponent.checkboxAll = false;
            thisComponent.commonTableService.deleteData(thisComponent.getCheckedData(), function (delResult) {
                var newStr = new String(delResult);
                if (newStr && newStr.indexOf('跨组织用户') > -1) {
                    thisComponent.alertService.showErrorAlert('删除失败', delResult);
                }
                thisComponent.getData();
            });
        }, undefined, undefined, text);

    }

    toEdits() {
        this.commonTableService.updateData(this.getCheckedData(), function (desc) {
        });
    }

    toDetail(data) {
        let editColumns = JSON.parse(JSON.stringify(this.columns));
        if (data) {
            let editData = JSON.parse(JSON.stringify(data));
            for (var index = 0, length = editColumns.length; index < length; index++) {
                let editColumnValue = editData[editColumns[index]['value']];
                let formatter: any = this.columns[index].formatter;
                editColumns[index]['defaultValue'] = formatter ? formatter(editColumnValue) : editColumnValue;
            }
        }
        const initialState = {
            initialState: {
                title: '详情展示',
                columns: editColumns
            }
        };
        this.formModalRef = this.modalService.show(DynamicTableDetailComponent, initialState);
    }

    toEdit(data?: any) {
        let thisTable = this;
        let editColumns = JSON.parse(JSON.stringify(this.columns));
        let editData;
        if (data) {
            editData = JSON.parse(JSON.stringify(data));
            for (var index = 0, length = editColumns.length; index < length; index++) {
                editColumns[index]['defaultValue'] = editData[editColumns[index]['value']];
                //修改时密码类不强制修改
                if (editColumns[index]['type'] === 'password') {
                    editColumns[index]['required'] = false;
                }
                if (editColumns[index].onlyAdd) {
                    editColumns[index]['motModified'] = true;
                }
            }
        }
        const initialState = {
            initialState: {
                title: data ? '修改' : '新增',
                columns: editColumns,
                commonTableService: this.commonTableService,
                data: editData
            }
        };
        this.formModalRef = this.modalService.show(DynamicFormComponent, initialState);
        this.formModalRef.content.onSubmitForm
            .subscribe((formData) => {
                thisTable.restSave(formData, editData);
            });
    }

    restSave(formData: any, data?: any) {
        let isAdd: boolean = !data;
        data = data ? data : formData;
        for (let formKey in formData) {
            data[formKey] = formData[formKey];
        }
        if (this.cumSaveParam) {
            for (let cumParam in this.cumSaveParam) {
                data[cumParam] = this.cumSaveParam[cumParam];
            }
        }
        if (this.commonTableService) {
            let thisTableComponent = this;
            if (isAdd) {
                this.commonTableService.addData(formData, function (desc) {
                    thisTableComponent.getData();
                })
            } else {
                this.commonTableService.updateData(formData, function (desc) {
                    thisTableComponent.getData();
                })
            }
        }

    }

    ngOnChanges() {
        this.getData();
    }

    searchByKeywords(event) {
        // 回车事件和点击搜索按钮触发搜索
        if (event) {
            var code = (event.keyCode ? event.keyCode : event.which);
            if (code != 13) {
                return;
            }
        }
        this.getData();
    }

    getData() {
        this.pageIndex = 1;
        if (!this.queryParam) {
            this.queryParam = {};
        }
        if (this.keyWords) {
            this.queryParam['keyword'] = this.keyWords;
        } else {
            this.queryParam['keyword'] = '';
        }
        this.queryParam['perPageNo'] = this.perPageNo;
        let thisTableComponent = this;
        if (this.commonTableService) {
            thisTableComponent.tbodyDatas = [];
            thisTableComponent.total = 0;
            thisTableComponent.countSingleCheckBox = 0;
            thisTableComponent.checkboxAll = false;
            this.checkboxClick.emit(undefined);
            this.commonTableService.getData(this.queryParam, function (result) {
                thisTableComponent.tbodyDatas = result ? result.data || [] : [];
                thisTableComponent.total = result ? result.totalNumbers : 0;
            });
        }
    }

    checkedAccess(method): boolean {
        return !(!Constants.access && method.access);
    }
}
