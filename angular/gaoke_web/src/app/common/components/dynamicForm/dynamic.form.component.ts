import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AttributeBase} from './attribute.base';
import {AttributeSelect} from './attribute.select';
import {AttributeInput} from './attribute.input';
import {BsModalRef} from 'ngx-bootstrap';
import {AttributeMark, CommonTableService} from '../dynamicTable/common.table.service';
import {VerifyFieldMethod} from '../dynamicTable/dynamic.table.option';

@Component({
    selector: 'atnd-dynamic-form',
    templateUrl: 'dynamic.form.template.html'
})
export class DynamicFormComponent implements OnInit {

    selectedOption(option, attribute) {
        let optionValue: any = option;
        if (attribute.options && attribute.options.optionKey) {
            optionValue = option[attribute.options.optionKey];
        }
        let attributeValue: any = attribute.defaultValue;
        return JSON.stringify(optionValue) === JSON.stringify(attributeValue);
    }

    verifyFieldMethods: VerifyFieldMethod [];
    title: string;
    closeBtnName: string = '关闭';
    columns: any;
    attributes: AttributeBase<any>[];
    dynamicFormGroup: FormGroup;
    @Output() onSubmitForm = new EventEmitter();
    commonTableService: CommonTableService;
    data: any;
    attributeMark: AttributeMark;

    constructor(public bsModalRef: BsModalRef) {
    }

    ngOnInit() {
        this.attributes = this.getAttributes();
        this.dynamicFormGroup = this.toFormGroup(this.attributes);
        window.addEventListener("popstate", ()=> {
            this.bsModalRef.hide();    
        });
    }

    isValid(attribute): boolean {
        return this.dynamicFormGroup.controls[attribute.attributeKey].valid;
    }

    restData(formData: any) {
        let backData = this.data ? this.data : formData;
        for (let formKey in formData) {
            backData[formKey] = formData[formKey];
        }
        return backData;
    }

    isValidAttributeMark(attribute): string {
        if (attribute.required && this.attributeMark) {
            let isValid = this.isValid(attribute);
            let attributeMark = attribute.attributeKey;
            if (isValid && this.attributeMark && (!this.attributeMark.isValid)) {
                if (attributeMark === this.attributeMark.validKey) {
                    return '* ' + this.attributeMark.validLabel;
                }
            }
            return '';
        }
        return '';
    }

    onSubmit() {
        this.attributeMark = undefined;
        let backData: any = this.restData(this.dynamicFormGroup.value);
        if (this.commonTableService) {
            let thisFormComponent = this;
            backData['isUpdateFromAttribute'] = (this.title === '修改');
            this.commonTableService.attributeCheck(backData, function (result) {
                delete backData.isUpdateFromAttribute;
                thisFormComponent.attributeMark = result;
                if (!(result && !result.isValid)) {
                    thisFormComponent.onSubmitForm.emit(backData);
                    thisFormComponent.bsModalRef.hide()
                }
            })
        } else {
            this.onSubmitForm.emit(backData);
            this.bsModalRef.hide();
        }
    }

    toFormGroup(attributes: AttributeBase<any>[]) {
        let group: any = {};
        attributes.forEach(attribute => {
            group[attribute.attributeKey] = attribute.required ? new FormControl(attribute.defaultValue || '', Validators.required)
                : new FormControl(attribute.defaultValue || '');
        });
        return new FormGroup(group);
    }

    getAttributes() {
        let attributes: AttributeBase<any>[] = [];
        this.columns = this.columns || [];
        let idx = 0;
        this.columns.forEach(function (column) {
            if (!column.motModified) {
                idx++;
                if (column && column.type) {
                    switch (column.type) {
                        case 'list':
                            attributes.push(new AttributeSelect(column.value, idx, column.name, column.options, column.optionLabel, column.optionKey, column.required, column.defaultValue));
                            break;
                        case 'text':
                            attributes.push(new AttributeInput(column.value, idx, column.name, column.required, undefined, column.defaultValue, {maxlength: column.maxlength}));
                            break;
                        case 'password':
                            attributes.push(new AttributeInput(column.value, idx, column.name, column.required, undefined, column.defaultValue));
                            break;
                        default:
                            break;
                    }
                }
            }
        });
        return attributes.sort((a, b) => a.order - b.order);
    }
}
